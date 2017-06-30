/**
  * searchHelper.js
  * Created by Kevin Li 11/2/16
  **/

import Axios, { CancelToken } from 'axios';

import kGlobalConstants from 'GlobalConstants';

// perform search is a cancellable promise
export const performSearch = (searchParams) => {
    const source = CancelToken.source();
    return {
        promise: Axios.request({
            url: 'v1/awards/',
            baseURL: kGlobalConstants.API,
            method: 'post',
            data: searchParams,
            cancelToken: source.token
        }),
        cancel() {
            source.cancel();
        }
    };
};

// convenience function for performing paged searches
export const performPagedSearch = (filters = [], page = 1, limit = 15, order = null, fields = null,
        exclude = null) => {
    const params = { filters, page, limit };

    if (order) {
        params.order = order;
    }

    if (fields != null) {
        // we have specific fields to query for
        params.fields = fields;
    }
    else if (exclude != null) {
        // we have specific fields to exclude
        params.exclude = exclude;
    }

    return performSearch(params);
};

// function for determining which award tabs to default to
export const fetchAwardCounts = (params) => {
    const source = CancelToken.source();
    return {
        promise: Axios.request({
            url: 'v1/awards/total/',
            baseURL: kGlobalConstants.API,
            method: 'post',
            data: params,
            cancelToken: source.token
        }),
        cancel() {
            source.cancel();
        }
    };
};

// Location search for autocomplete
export const fetchLocations = (req) => {
    const source = CancelToken.source();
    return {
        promise: Axios.request({
            url: 'v1/references/locations/geocomplete/',
            baseURL: kGlobalConstants.API,
            method: 'post',
            data: req,
            cancelToken: source.token
        }),
        cancel() {
            source.cancel();
        }
    };
};

// Budget Category autocomplete searches
export const fetchBudgetFunctions = (req) => {
    const source = CancelToken.source();
    return {
        promise: Axios.request({
            url: 'v1/tas/autocomplete/',
            baseURL: kGlobalConstants.API,
            method: 'post',
            data: req,
            cancelToken: source.token
        }),
        cancel() {
            source.cancel();
        }
    };
};

export const fetchFederalAccounts = (req) => {
    const source = CancelToken.source();
    return {
        promise: Axios.request({
            url: 'v1/federal_accounts/autocomplete/',
            baseURL: kGlobalConstants.API,
            method: 'post',
            data: req,
            cancelToken: source.token
        }),
        cancel() {
            source.cancel();
        }
    };
};

// Agency search for autocomplete
export const fetchAgencies = (req) => {
    const source = CancelToken.source();
    return {
        promise: Axios.request({
            url: 'v1/references/agency/autocomplete/',
            baseURL: kGlobalConstants.API,
            method: 'post',
            data: req,
            cancelToken: source.token
        }),
        cancel() {
            source.cancel();
        }
    };
};

// Fetch Individual Award
export const fetchAward = (num) => {
    const source = CancelToken.source();
    return {
        promise: Axios.request({
            url: `v1/awards/${num}/`,
            baseURL: kGlobalConstants.API,
            method: 'get',
            cancelToken: source.token
        }),
        cancel() {
            source.cancel();
        }
    };
};

// Fetch Individual Award's Transactions
export const fetchAwardTransaction = (params) => {
    const source = CancelToken.source();
    return {
        promise: Axios.request({
            url: `v1/transactions/`,
            baseURL: kGlobalConstants.API,
            method: 'post',
            data: params,
            cancelToken: source.token
        }),
        cancel() {
            source.cancel();
        }
    };
};

// Fetch Recipients
export const fetchRecipients = (req) => {
    const source = CancelToken.source();
    return {
        promise: Axios.request({
            url: 'v1/references/recipients/autocomplete/',
            baseURL: kGlobalConstants.API,
            method: 'post',
            data: req,
            cancelToken: source.token
        }),
        cancel() {
            source.cancel();
        }
    };
};

// Fetch Award IDs
export const fetchAwardIDs = (params) => {
    const source = CancelToken.source();
    return {
        promise: Axios.request({
            url: 'v1/awards/autocomplete/',
            baseURL: kGlobalConstants.API,
            method: 'post',
            data: params,
            cancelToken: source.token
        }),
        cancel() {
            source.cancel();
        }
    };
};

// make API call to awards total aggregation endpoint
export const performTransactionsTotalSearch = (params) => {
    const source = CancelToken.source();
    return {
        promise: Axios.request({
            url: 'v1/transactions/total/',
            baseURL: kGlobalConstants.API,
            method: 'post',
            data: params,
            cancelToken: source.token
        }),
        cancel() {
            source.cancel();
        }
    };
};

// make API call to categories total endpoint
// Use this in the Spending By Category search for Budget Categories
export const performCategorySearch = (params) => {
    const source = CancelToken.source();
    return {
        promise: Axios.request({
            url: 'v1/accounts/awards/total/',
            baseURL: kGlobalConstants.API,
            method: 'post',
            data: params,
            cancelToken: source.token
        }),
        cancel() {
            source.cancel();
        }
    };
};

// make API call to balances total endpoint
// Use this in the Spending Over Time search for Budget Categories
export const performBalancesSearch = (params) => {
    const source = CancelToken.source();
    return {
        promise: Axios.request({
            url: 'v1/tas/balances/total/',
            baseURL: kGlobalConstants.API,
            method: 'post',
            data: params,
            cancelToken: source.token
        }),
        cancel() {
            source.cancel();
        }
    };
};

export const performFinancialAccountAggregation = (params) => {
    const source = CancelToken.source();
    return {
        promise: Axios.request({
            url: 'v1/accounts/awards/total/',
            baseURL: kGlobalConstants.API,
            method: 'post',
            data: params,
            cancelToken: source.token
        }),
        cancel() {
            source.cancel();
        }
    };
};


export const performFinancialSystemLookup = (params) => {
    const source = CancelToken.source();
    return {
        promise: Axios.request({
            url: 'v1/accounts/awards/',
            baseURL: kGlobalConstants.API,
            method: 'post',
            data: params,
            cancelToken: source.token
        }),
        cancel() {
            source.cancel();
        }
    };
};

export const performSubawardSearch = (data) => {
    const source = CancelToken.source();
    return {
        promise: Axios.request({
            data,
            url: 'v1/subawards/',
            baseURL: kGlobalConstants.API,
            method: 'post',
            cancelToken: source.token
        }),
        cancel() {
            source.cancel();
        }
    };
};

export const generateUrlHash = (data) => {
    const source = CancelToken.source();
    return {
        promise: Axios.request({
            data,
            url: 'v1/references/filter/',
            baseURL: kGlobalConstants.API,
            method: 'post',
            cancelToken: source.token
        }),
        cancel() {
            source.cancel();
        }
    };
};

export const restoreUrlHash = (data) => {
    const source = CancelToken.source();
    return {
        promise: Axios.request({
            data,
            url: 'v1/references/hash/',
            baseURL: kGlobalConstants.API,
            method: 'post',
            cancelToken: source.token
        }),
        cancel() {
            source.cancel();
        }
    };
};
