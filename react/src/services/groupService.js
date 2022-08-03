import axios from 'axios';
import { API_HOST_PREFIX, onGlobalSuccess, onGlobalError } from './serviceHelpers';

const groupsApi = {
    endpoint: `${API_HOST_PREFIX}/api/groups`,
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
const orgConfirmationEmail = (payload) => {
    const config = {
        method: 'POST',
        url: groupsApi.endpoint + '/emails',
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config);
};

const createGroup = (payload) => {
    const config = {
        method: 'POST',
        url: groupsApi.endpoint,
        data: payload,
        withCredentials: true, //what is this with credentials
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };

    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getGroupById = (groupId) => {
    const config = {
        method: 'GET',
        url: `${groupsApi.endpoint}/${groupId}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getAllGroupsPaginated = (pageIndex, pageSize) => {
    const config = {
        method: 'GET',
        url: `${groupsApi.endpoint}/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const updateGroup = (groupId, payload) => {
    const config = {
        method: 'PUT',
        url: `${groupsApi.endpoint}/${groupId}`,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const deleteGroup = (groupId) => {
    const config = {
        method: 'DELETE',
        url: `${groupsApi.endpoint}/${groupId}`,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(() => {
        return groupId;
    });
};

const getGroupByCreatedByPaginated = (createdById, pageIndex, pageSize) => {
    const config = {
        method: 'GET',
        url: `${groupsApi.endpoint}/createdby/${createdById}/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config);
};

const getAllGroupTypesPaginated = (pageIndex, pageSize) => {
    const config = {
        method: 'GET',
        url: `${groupsApi.endpoint}/grouptype/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getGroupByGroupTypePaginated = (groupTypeName, pageIndex, pageSize) => {
    const config = {
        method: 'GET',
        url: `${groupsApi.endpoint}/grouptypepaginate?groupTypeName=${groupTypeName}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

export {
    createGroup,
    getGroupById,
    getAllGroupsPaginated,
    updateGroup,
    deleteGroup,
    getGroupByCreatedByPaginated,
    getAllGroupTypesPaginated,
    getGroupByGroupTypePaginated,
    orgConfirmationEmail,
    getLookups,
};
