import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import debug from 'sabio-debug';
import Organization from './Organization';
import Pagination from 'rc-pagination';
import locale from 'rc-pagination/lib/locale/en_US';
import 'rc-pagination/assets/index.css';
import * as groupServices from '../../services/groupService';
import * as toastr from 'toastr';
import 'toastr/build/toastr.css';
import { Col, Row } from 'react-bootstrap';

const _logger = debug.extend('SearchOrganizations');

function SearchOrganizations() {
    const [buttons, setButtons] = useState();
    useEffect(() => {
        let payload = ['GroupTypes'];
        groupServices.getLookups(payload).then(onGetLookupSuccess).catch(onGetLookupError);
    }, []);

    const onGetLookupSuccess = (response) => {
        _logger('onGetLookupSuccess', response);
        setButtons((prevState) => {
            let pd = { ...prevState };
            pd = response.data.item.groupTypes;
            return pd;
        });
    };

    const onGetLookupError = (err) => {
        _logger('onSearchBlogCategoriesError', err);
    };

    const [groupType, setGroupType] = useState('showAll');
    const [groups, setGroups] = useState({
        arrayOfOrganizations: [],
        organizationComponents: [],
        page: { pageIndex: 0, pageSize: 0, totalCount: 0, totalPages: 0 },
    });

    const location = useLocation();
    const [mentorData] = useState(location.state);
    _logger(mentorData);

    const onHandleFilterButtonClick = (e) => {
        const gt_ = e.currentTarget.value;
        setGroupType(() => {
            return gt_;
        });
    };
    const onGetGroupByTypeSuccess = (data) => {
        let arrayOfGroups = data.item.pagedItems;
        setGroups((prevState) => {
            let pd = { ...prevState };
            pd.arrayOfOrganizations = arrayOfGroups;
            pd.organizationComponents = arrayOfGroups.map(mapOrganization);
            pd.page.pageIndex = data.item.pageIndex;
            pd.page.pageSize = data.item.pageSize;
            pd.page.totalCount = data.item.totalCount;
            pd.page.totalPages = data.item.totalPages;

            return pd;
        });
    };
    const onGetGroupByTypeError = (error) => {
        _logger(error);
        toastr.error('message', error);
    };

    const mapFilterButton = (button) => {
        return (
            <button
                type="button"
                className="btn btn-primary rounded-pill"
                tyle={{ margin: 10 }}
                value={button.name}
                key={button.name}
                onClick={onHandleFilterButtonClick}>
                {button.name}
            </button>
        );
    };

    useEffect(() => {
        if (groupType !== 'showAll') {
            groupServices
                .getGroupByGroupTypePaginated(groupType, 0, 3)
                .then(onGetGroupByTypeSuccess)
                .catch(onGetGroupByTypeError);
        } else {
            groupServices.getAllGroupsPaginated(0, 3).then(onGetGroupSuccess).catch(onGetGroupError);
        }
    }, [groupType]);

    const onGetGroupSuccess = (data) => {
        let arrayOfGroups = data.item.pagedItems;
        setGroups((prevState) => {
            let pd = { ...prevState };
            pd.arrayOfOrganizations = arrayOfGroups;
            pd.organizationComponents = arrayOfGroups.map(mapOrganization);
            pd.page.pageIndex = data.item.pageIndex;
            pd.page.pageSize = data.item.pageSize;
            pd.page.totalCount = data.item.totalCount;
            pd.page.totalPages = data.item.totalPages;

            return pd;
        });
    };
    const onGetGroupError = (error) => {
        _logger(error);
        toastr.error(error);
    };

    function mapOrganization(organizationObj) {
        const aOrgData = { data: mentorData, id: organizationObj.id };

        return (
            <React.Fragment>
                <Organization key={organizationObj.id} organization={organizationObj} state={aOrgData} />
            </React.Fragment>
        );
    }
    const onChange = (currentPage) => {
        if (groupType !== 'showAll') {
            groupServices
                .getGroupByGroupTypePaginated(groupType, currentPage - 1, groups.page.pageSize)
                .then(onGetGroupByTypeSuccess)
                .catch(onGetGroupByTypeError);
        } else {
            groupServices
                .getAllGroupsPaginated(currentPage - 1, groups.page.pageSize)
                .then(onGetGroupSuccess)
                .catch(onGetGroupError);
        }
    };
    const onAddAGroupClicked = (e) => {
        e.preventDefault();
    };

    return (
        <React.Fragment>
            <div className="m-3">
                <div className="card container">
                    <Col>
                        <h1
                            className="mb-2"
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            Our current partners
                        </h1>
                    </Col>
                    <div className="mb-1">
                        <button
                            type="button"
                            className="btn btn-warning rounded-pill"
                            tyle={{ margin: 10 }}
                            value="showAll"
                            key="showAll"
                            onClick={onHandleFilterButtonClick}>
                            Show All
                        </button>
                    </div>
                    <div className="">{buttons?.map(mapFilterButton)}</div>
                    <div className="container row mt-3 mb-3" style={{ marginTop: '3' }}>
                        <Pagination
                            onChange={onChange}
                            current={groups.page.pageIndex + 1}
                            total={groups.page.totalCount}
                            locale={locale}
                            pageSize={3}
                        />
                    </div>
                    <div
                        className="container"
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div className="col">{groups.organizationComponents}</div>
                    </div>

                    <div className="container mb-3">
                        <Row>
                            <Col>
                                <Pagination
                                    onChange={onChange}
                                    current={groups.page.pageIndex + 1}
                                    total={groups.page.totalCount}
                                    locale={locale}
                                    pageSize={3}
                                />
                            </Col>
                            <Col>
                                <button
                                    type="button"
                                    className="mx-2 mt-3 mb-3 btn btn-warning"
                                    onClick={onAddAGroupClicked}>
                                    Add a group
                                </button>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
export default SearchOrganizations;
