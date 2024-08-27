/**
 * AccountDataContainer.jsx
 * Created by Lizzie Salita 4/23/18
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as BulkDownloadHelper from 'helpers/bulkDownloadHelper';
import * as bulkDownloadActions from 'redux/actions/bulkDownload/bulkDownloadActions';

import AccountDataContent from 'components/bulkDownload/accounts/AccountDataContent';

const propTypes = {
    updateDownloadFilter: PropTypes.func,
    clearDownloadFilters: PropTypes.func,
    bulkDownload: PropTypes.object,
    clickedDownload: PropTypes.func,
    setDefCodes: PropTypes.func
};

const AccountDataContainer = (props) => {
    const [agencies, setAgencies] = useState({
        cfoAgencies: [],
        otherAgencies: []
    });
    const [federalAccounts, setFederalAccounts] = useState([]);
    const [budgetFunctions, setBudgetFunctions] = useState([]);
    const [budgetSubfunctions, setBudgetSubfunctions] = useState([]);

    let agencyListRequest = null;
    let federalAccountListRequest = null;
    let budgetFunctionListRequest = null;
    let budgetSubfunctionListRequest = null;

    const updateFilter = (name, value) => {
        props.updateDownloadFilter({
            dataType: 'accounts',
            name,
            value
        });
    };

    const resetFederalAccount = () => {
        updateFilter('federalAccount', {
            id: '',
            name: 'Select a Federal Account'
        });
    };

    const setFederalAccountList = async (agencyCode, page = 1) => {
        if (agencyCode !== '') {
            if (federalAccountListRequest) {
                federalAccountListRequest.cancel();
            }

            federalAccountListRequest = BulkDownloadHelper.requestFederalAccountList(agencyCode, page);
            try {
                const { data } = await federalAccountListRequest.promise;
                setFederalAccounts(
                    page > 1
                        // we're requesting the second page, concat array
                        ? [...federalAccounts, ...data.results]
                        : data.results
                );

                if (data.hasNext) {
                    setFederalAccountList(agencyCode, page + 1);
                }
            }
            catch (e) {
                console.log(e);
                federalAccountListRequest = null;
            }
        }
        else {
            setFederalAccounts([]);
            resetFederalAccount();
        }
    };

    const setBudgetFunctionList = () => {
        if (budgetFunctionListRequest) {
            budgetFunctionListRequest.cancel();
        }

        // perform the API request
        budgetFunctionListRequest = BulkDownloadHelper.requestBudgetFunctionList();

        budgetFunctionListRequest.promise
            .then((res) => {
                const budgetFunctionsResults = res.data.results;
                setBudgetFunctions(budgetFunctionsResults);
            })
            .catch((err) => {
                console.log(err);
                budgetFunctionListRequest = null;
            });
    };

    const resetBudgetSubfunction = () => {
        updateFilter('budgetSubfunction', {
            code: '',
            title: 'Select a Budget Sub-Function'
        });
    };

    const setBudgetSubfunctionList = (budgetFunction) => {
        if (budgetFunction !== '') {
            if (budgetSubfunctionListRequest) {
                budgetSubfunctionListRequest.cancel();
            }

            budgetSubfunctionListRequest = BulkDownloadHelper.requestBudgetSubfunctionList({
                budget_function: budgetFunction
            });

            budgetSubfunctionListRequest.promise
                .then((res) => {
                    const budgetSubfunctionsResults = res.data.results;
                    setBudgetSubfunctions(budgetSubfunctionsResults);
                })
                .catch((err) => {
                    console.log(err);
                    budgetSubfunctionListRequest = null;
                });
        }
        else {
            setBudgetSubfunctions([]);
            resetBudgetSubfunction();
        }
    };

    const clearAccountFilters = () => {
        props.clearDownloadFilters('accounts');
    };

    const setAgencyList = () => {
        if (agencyListRequest) {
            agencyListRequest.cancel();
        }

        // perform the API request
        agencyListRequest = BulkDownloadHelper.requestAgenciesList({
            type: "account_agencies",
            agency: 0
        });

        agencyListRequest.promise
            .then((res) => {
                const cfoAgencies = res.data.agencies.cfo_agencies;
                const otherAgencies = res.data.agencies.other_agencies;
                setAgencies({
                    cfoAgencies,
                    otherAgencies
                });
            })
            .catch((err) => {
                console.log(err);
                agencyListRequest = null;
            });
    };

    useEffect(() => {
        setAgencyList();
        setBudgetFunctionList();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AccountDataContent
            setDefCodes={props.setDefCodes}
            accounts={props.bulkDownload.accounts}
            federalAccounts={federalAccounts}
            setFederalAccountList={setFederalAccountList}
            updateFilter={updateFilter}
            clearAccountFilters={clearAccountFilters}
            agencies={agencies}
            budgetFunctions={budgetFunctions}
            budgetSubfunctions={budgetSubfunctions}
            setBudgetSubfunctionList={setBudgetSubfunctionList}
            clickedDownload={props.clickedDownload} />
    );
};

AccountDataContainer.propTypes = propTypes;

export default connect(
    (state) => ({ bulkDownload: state.bulkDownload }),
    (dispatch) => bindActionCreators(bulkDownloadActions, dispatch)
)(AccountDataContainer);
