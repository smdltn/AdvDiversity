import axios from 'axios';
import * as helper from './serviceHelpers';
import debug from 'sabio-debug';
import { API_HOST_PREFIX, onGlobalSuccess, onGlobalError } from './serviceHelpers';
const _logger = debug.extend('faqsServices');

const faqServices = {
    endpoint: `${API_HOST_PREFIX}/api/Faqs/`,
};

const sendFaqEmails = (payload) => {
    const config = {
        method: 'POST',
        url: faqServices.endpoint + `emails`,
        data: payload,
        crossdomain: true,
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config);
};
const getLookups = (payload) => {
    const config = {
        method: 'POST',
        url: process.env.REACT_APP_API_HOST_PREFIX + '/api/lookups',
        data: payload,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config);
};
const getFaqs = () => {
    const config = {
        method: 'GET',
        url: faqServices.endpoint + `SelectAllDetails`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(onGlobalError);
};

const faqPost = (payload) => {
    _logger('Payload --->', { payload });
    const config = {
        method: 'POST',
        url: 'https://localhost:50001/api/Faqs',
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const updateFaqs = (faqId, payload) => {
    const config = {
        method: 'PUT',
        url: `${faqServices.endpoint}${faqId}`,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getFaqsByCategory = (faqsCategory) => {
    const config = {
        method: 'GET',
        url: `${faqServices.endpoint}category?category=${faqsCategory}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getAllFaqsPaginated = (pageIndex, pageSize) => {
    const config = {
        method: 'GET',
        url: `${faqServices.endpoint}paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getAllFaqByCategoryPaginated = (category, pageIndex, pageSize) => {
    const config = {
        method: 'GET',
        url: `${faqServices.endpoint}bycategorypaginate?category=${category}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const deleteFaqById = (faqId) => {
    const config = {
        method: 'DELETE',
        url: `${faqServices.endpoint}${faqId}`,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(() => {
        return faqId;
    });
};

const getFaqById = (faqId) => {
    const config = {
        method: 'GET',
        url: `${faqServices.endpoint}${faqId}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

export {
    getFaqs,
    faqPost,
    updateFaqs,
    getLookups,
    getFaqsByCategory,
    sendFaqEmails,
    getAllFaqsPaginated,
    deleteFaqById,
    getFaqById,
    getAllFaqByCategoryPaginated,
};
