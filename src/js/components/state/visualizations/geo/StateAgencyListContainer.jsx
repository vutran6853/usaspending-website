/**
* StateAgencyListContainer.jsx
* Created by Nick Torres 8/12/2024
**/

import React from 'react';
import PropTypes from 'prop-types';
import { isCancel } from 'axios';
import { filter, sortBy, slice, concat, uniqueId } from 'lodash';
import { Search } from 'js-search';
import Autocomplete from 'components/sharedComponents/autocomplete/Autocomplete';
import * as SearchHelper from 'helpers/searchHelper';

const propTypes = {
    toggleAgency: PropTypes.func,
    selectedAgencies: PropTypes.object,
    agencyType: PropTypes.string,
    placeHolder: PropTypes.string
};

export default class StateAgencyListContainer extends React.Component {
    constructor(props) {
        super(props);

        this.handleTextInput = this.handleTextInput.bind(this);

        this.state = {
            agencySearchString: '',
            autocompleteType: '',
            autocompleteAgencies: [],
            noResults: false,
            loading: true,
            error: false,
            data: {
                values: [],
                locations: []
            },
            renderHash: `geo-${uniqueId()}`
        };

        this.apiRequest = null;
        this.handleTextInput = this.handleTextInput.bind(this);
        this.clearAutocompleteSuggestions = this.clearAutocompleteSuggestions.bind(this);
        this.timeout = null;
    }

    parseAutocompleteAgencies(results) {
        let agencies = [];
        let noResults = false;

        // Format results of search for use in Autocomplete component
        if (results) {
            results.forEach((item) => {
                let subAbbreviation = '';
                let topAbbreviation = '';
                if (item.subtier_agency.abbreviation) {
                    subAbbreviation = `(${item.subtier_agency.abbreviation})`;
                }
                if (item.toptier_agency.abbreviation) {
                    topAbbreviation = `(${item.toptier_agency.abbreviation})`;
                }

                // Only push items if they are not in selectedAgencies
                if (item.toptier_flag) {
                    if (this.props.selectedAgencies.size === 0
                        || !this.props.selectedAgencies.has(`${item.id}_toptier`)) {
                        agencies.push({
                            title: `${item.subtier_agency.name} ${topAbbreviation}`,
                            data: Object.assign({}, item, {
                                agencyType: 'toptier'
                            })
                        });
                    }
                }
                else if (this.props.selectedAgencies.size === 0
                    || !this.props.selectedAgencies.has(`${item.id}_subtier`)) {
                    agencies.push({
                        title: `${item.subtier_agency.name} ${subAbbreviation}`,
                        subtitle: `Sub-Agency of ${item.toptier_agency.name} ${topAbbreviation}`,
                        data: Object.assign({}, item, {
                            agencyType: 'subtier'
                        })
                    });
                }
            });

            if (agencies.length === 0) {
                noResults = true;
            }
        }

        // For searches for FEMA, leave the results in the same order as the API response
        if ((this.state.agencySearchString.toLowerCase() !== 'fem') && (this.state.agencySearchString.toLowerCase() !== 'fema')) {
            // Separate top and subtier agencies
            let toptierAgencies = filter(agencies, ['data.agencyType', 'toptier']);
            let subtierAgencies = filter(agencies, ['data.agencyType', 'subtier']);

            // Sort individual groups alphabetically
            toptierAgencies = sortBy(toptierAgencies, 'title');
            subtierAgencies = sortBy(subtierAgencies, 'title');

            agencies = slice(concat(toptierAgencies, subtierAgencies), 0, 10);
        }

        this.setState({
            noResults,
            autocompleteAgencies: agencies
        });
    }

    queryAutocompleteAgencies(input) {
        this.setState({
            noResults: false
        });

        // Only search if search is 2 or more characters
        if (input.length >= 3) {
            this.setState({
                agencySearchString: input
            });

            if (this.agencySearchRequest) {
                // A request is currently in-flight, cancel it
                this.agencySearchRequest.cancel();
            }

            const agencySearchParams = {
                search_text: input,
                limit: 20
            };

            if (this.props.agencyType === 'Funding') {
                this.agencySearchRequest = SearchHelper.fetchFundingAgencies(agencySearchParams);
            }
            else {
                this.agencySearchRequest = SearchHelper.fetchAwardingAgencies(agencySearchParams);
            }

            this.agencySearchRequest.promise
                .then((res) => {
                    this.performSecondarySearch(res.data.results);
                })
                .catch((err) => {
                    if (!isCancel(err)) {
                        this.setState({
                            noResults: true
                        });
                    }
                });
        }
        else if (this.agencySearchRequest) {
            // A request is currently in-flight, cancel it
            this.agencySearchRequest.cancel();
        }
    }

    performSecondarySearch(data) {
        if ((this.state.agencySearchString.toLowerCase() === 'fem') || (this.state.agencySearchString.toLowerCase() === 'fema')) {
            // don't change the order of results returned from the API
            this.parseAutocompleteAgencies(slice(data, 0, 10));
        }

        else {
            // search within the returned data
            // create a search index with the API response records
            const search = new Search('id');
            search.addIndex(['toptier_agency', 'name']);
            search.addIndex(['subtier_agency', 'name']);
            search.addIndex(['toptier_agency', 'abbreviation']);
            search.addIndex(['subtier_agency', 'abbreviation']);

            // add the API response as the data source to search within
            search.addDocuments(data);

            // use the JS search library to search within the records
            const results = search.search(this.state.agencySearchString);

            const toptier = [];
            const subtier = [];

            // re-group the responses by top tier and subtier
            results.forEach((item) => {
                if (item.toptier_flag) {
                    toptier.push(item);
                }
                else {
                    subtier.push(item);
                }
            });

            // combine the two arrays and limit it to 10
            const improvedResults = slice(concat(toptier, subtier), 0, 10);

            // Add search results to Redux
            this.parseAutocompleteAgencies(improvedResults);
        }
    }

    clearAutocompleteSuggestions() {
        this.setState({
            autocompleteAgencies: []
        });
    }

    handleTextInput(agencyInput) {
    // Clear existing agencies to ensure user can't select an old or existing one
        if (this.state.autocompleteAgencies.length > 0) {
            this.setState({
                autocompleteAgencies: []
            });
        }

        // Grab input, clear any exiting timeout
        const input = agencyInput.target.value;
        window.clearTimeout(this.timeout);

        // Perform search if user doesn't type again for 300ms
        this.timeout = window.setTimeout(() => {
            this.queryAutocompleteAgencies(input);
        }, 300);
    }

    toggleAgency(agency, valid) {
        // Pass selected agency to parent toggleAgency method, adding agencyType to method call
        this.props.toggleAgency(agency, valid, this.props.agencyType);
        const inputBox = document.getElementById("state__agency-id");

        // apply staged awarding agency filter here
        const newSearch = this.props.searchData;
        newSearch.filters.agencies = [];
        newSearch.filters.agencies.push(
            {
                name: valid.title,
                tier: valid.data.agencyType,
                type: "awarding"
            }
        );

        // Clear Autocomplete results
        this.setState({
            autocompleteAgencies: []
        }, () => {
            inputBox.value = valid.title;
            console.debug(this.props);
            // this.props.searchData = newSearch;
            // generate the API parameters
            if (this.apiRequest) {
                this.apiRequest.cancel();
            }
            this.setState({
                loading: true,
                error: false
            });
            this.apiRequest = SearchHelper.performSpendingByGeographySearch(newSearch);
            this.apiRequest.promise
                .then((res) => {
                    this.parseData(res.data);
                    this.apiRequest = null;
                })
                .catch((err) => {
                    if (!isCancel(err)) {
                        console.log(err);
                        this.apiRequest = null;

                        this.setState({
                            loading: false,
                            error: true
                        });
                    }
                });
        });
    }
    parseData(data) {
        const spendingValues = [];
        const spendingShapes = [];
        const spendingLabels = {};

        data.results.forEach((item) => {
            // state must not be null or empty string
            if (item.shape_code && item.shape_code !== '') {
                spendingShapes.push(item.shape_code);
                spendingValues.push(parseFloat(item.aggregated_amount));
                spendingLabels[item.shape_code] = {
                    label: item.display_name,
                    value: parseFloat(item.aggregated_amount)
                };
            }
        });

        // needs to set state on props.data
        this.setState({
            data: {
                values: spendingValues,
                locations: spendingShapes,
                labels: spendingLabels
            },
            renderHash: `geo-${uniqueId()}`,
            loading: false,
            error: false
        });
    }
    render() {
        return (
            <Autocomplete
                {...this.props}
                id="state__agency-id"
                values={this.state.autocompleteAgencies}
                handleTextInput={this.handleTextInput}
                onSelect={this.toggleAgency.bind(this)}
                placeholder={this.props.placeHolder !== '' ? this.props.placeHolder : `${this.props.agencyType} Agency`}
                ref={(input) => {
                    this.agencyList = input;
                }}
                label={`${this.props.agencyType} Agency`}
                clearAutocompleteSuggestions={this.clearAutocompleteSuggestions}
                noResults={this.state.noResults}
                retainValue />
        );
    }
}

StateAgencyListContainer.propTypes = propTypes;
