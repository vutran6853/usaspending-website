/**
 * TopFiveContainer.jsx
 * Created by Kevin Li 5/15/18
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isCancel } from 'axios';

import { getTrailingTwelveMonths, convertFYToDateRange } from 'helpers/fiscalYearHelper';
import * as SearchHelper from 'helpers/searchHelper';
import BaseStateCategoryResult from 'models/v2/state/BaseStateCategoryResult';
import { awardTypeGroups } from 'dataMapping/search/awardType';
import TopFive from 'components/state/topFive/TopFive';

const propTypes = {
    total: PropTypes.number,
    category: PropTypes.string,
    fy: PropTypes.string,
    type: PropTypes.string
}

const TopFiveContainer = (props) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [results, setResults] = useState([]);

    request = null;

    dataParams() {
        let timePeriod = null;
        if (props.fy === 'latest') {
            const trailing = getTrailingTwelveMonths();
            timePeriod = {
                start_date: trailing[0],
                end_date: trailing[1]
            };
        }
        else if (props.fy !== 'all' && props.fy) {
            const range = convertFYToDateRange(parseInt(props.fy, 10));
            timePeriod = {
                start_date: range[0],
                end_date: range[1]
            };
        }

        const filters = {
            place_of_performance_scope: 'domestic',
            place_of_performance_locations: [
                {
                    country: 'USA',
                    state: props.code
                }
            ]
        };

        if (timePeriod) {
            filters.time_period = [timePeriod];
        }

        if (props.type !== 'all' && awardTypeGroups[props.type]) {
            filters.award_type_codes = awardTypeGroups[props.type];
        }

        const params = {
            filters,
            category: props.category,
            limit: 5,
            page: 1
        };

        if (props.category === 'awards') {
            filters.award_type_codes = ['A', 'B', 'C', 'D'];
            params.fields = ['Award ID', 'Award Amount', 'generated_internal_id'];
            params.order = 'desc';
            params.sort = 'Award Amount';
            params.subawards = false;
        }

        return params;
    }

    parseResults(data, type) {
        const parsed = data.map((item, index) => {
            const result = Object.create(BaseStateCategoryResult);
            if (props.category === 'awards') {
                result.populate({
                    name: item['Award ID'],
                    amount: item['Award Amount'],
                    agency_slug: item.generated_internal_id,
                    category: props.category
                }, index + 1);
            }
            else {
                result.populate({ ...item, category: props.category }, index + 1);
            }

            if (type === 'awarding_agency' || type === 'awarding_subagency') {
                result.nameTemplate = (code, name) => {
                    if (code) {
                        return `${name} (${code})`;
                    }
                    return name;
                };
            }
            else if (type === 'recipient') {
                result.nameTemplate = (code, name) => name;
            }
            else if (type === 'county' || type === 'district') {
                result.nameTemplate = (code, name) => (name);
            }

            return result;
        });
        setLoading(false);
        setError(false);
        setResults(parsed);
    }

    loadCategory() {
        if (!props.code) {
            setLoading(false);
            setError(true);
            return;
        }

        if (request) {
            request.cancel();
        }

        setLoading(true);
        setError(false);

        if (props.category === 'awards') {
            request = SearchHelper.performSpendingByAwardSearch(dataParams());
        }
        else {
            request = SearchHelper.performSpendingByCategorySearch(dataParams());
        }

        request.promise
            .then((res) => {
                parseResults(res.data.results, res.data.category);
            })
            .catch((err) => {
                if (!isCancel(err)) {
                    console.log(err);
                    setLoading(false);
                    setError(true);
                }
            });
    }

    useEffect(() => {
            loadCategory();
        }, [])

    useEffect(() => {
            loadCategory();
        }, [code, fy, type])

        return (
            <TopFive
                category={props.category}
                total={props.total}
                {...state} />
        );

}

export default connect(
    (state) => ({
        code: state.stateProfile.overview.code,
        total: state.stateProfile.overview._totalAmount,
        fy: state.stateProfile.fy
    })
)(TopFiveContainer);
