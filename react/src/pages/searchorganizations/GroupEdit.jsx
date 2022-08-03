import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import debug from 'sabio-debug';
import * as groupServices from '../../services/groupService';
import toastr from 'toastr';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import { Col, Row } from 'react-bootstrap';
import { groupFormSchema } from '../../schema/groupsFormSchema';

const _logger = debug.extend('GroupEdit');

function GroupEdit() {
    const navigate = useNavigate();
    const location = useLocation();
    const mentorData = location.state;

    const [groupTypes, setGroupTypes] = useState();
    useEffect(() => {
        let payload = ['GroupTypes'];
        groupServices.getLookups(payload).then(onGetLookupSuccess).catch(onGetLookupError);
    }, []);

    const onGetLookupSuccess = (response) => {
        _logger('onGetLookupSuccess', response);
        setGroupTypes((prevState) => {
            let pd = { ...prevState };
            pd = response.data.item.groupTypes;
            return pd;
        });
    };

    const onGetLookupError = (err) => {
        _logger('onSearchBlogCategoriesError', err);
    };
    _logger(mentorData);

    const [selectedOrgData, setSelectedOrgData] = useState();

    useEffect(() => {
        groupServices.getGroupById(mentorData.id).then(onGetGroupByIdSuccess).catch(onGetGroupByIdError);
    }, []);
    const mapGroupType = (type) => {
        return (
            <option value={type.name} key={`type_${type.name}`}>
                {type.name}
            </option>
        );
    };
    const onGetGroupByIdSuccess = (data) => {
        false && _logger(data);
        let aGroupData = data.item;
        setSelectedOrgData((prevState) => {
            let od = { ...prevState };
            od = aGroupData;

            return od;
        });
    };
    false && _logger('selectedOrgData......', selectedOrgData);

    const onGetGroupByIdError = (error) => {
        _logger(error);
        toastr.err('message', error);
    };
    const handleSubmit = (values) => {
        _logger(values);
        const payload = {
            id: selectedOrgData.id,
            groupTypeId: values.groupType,
            name: values.name,
            headline: values.headline,
            description: values.description,
            logo: values.logo,
        };
        groupServices.updateGroup(selectedOrgData.id, payload).then(onUpdateSuccess).catch(onUpdateError);
    };
    const onUpdateSuccess = (response) => {
        _logger(response);
        toastr.success('message', response);
        navigate(-1);
    };
    const onUpdateError = (error) => {
        _logger(error);
    };
    const onHandleGoBackToSearchResults = () => {
        navigate(-1, { state: mentorData });
    };
    const onHandleGoBackToSearchAgain = () => {
        navigate('/becomeamentor');
    };
    return (
        <React.Fragment>
            <div className="container">
                <h1 className="text-danger">Hello {`${mentorData.data.firstName} ${mentorData.data.lastName}`}</h1>
                <div>
                    <button
                        type="button"
                        className="btn btn-primary rounded-pill"
                        value="backToSearchResults"
                        style={{ margin: 10 }}
                        onClick={onHandleGoBackToSearchResults}>
                        Back To Search Results
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary rounded-pill"
                        value="searchAgain"
                        onClick={onHandleGoBackToSearchAgain}>
                        Search Again
                    </button>
                </div>
                <div className="row mb-6">
                    <div className="col col-lg-6">
                        <div className="row">
                            <div className="container">
                                <div className="mb-3">
                                    <h1>{selectedOrgData?.name}</h1>
                                </div>
                                <div className="mb-3 col">
                                    <h4>Headline</h4>
                                    <p>{selectedOrgData?.headline}</p>
                                </div>
                                <div className="mb-3">
                                    <h4>Description</h4>
                                    <p>{selectedOrgData?.description}</p>
                                </div>
                                <div>
                                    <h4>Group Type</h4>
                                    <p>{selectedOrgData?.groupTypeName}</p>
                                </div>
                            </div>
                            <div className="col mb-3">
                                <img src={selectedOrgData?.logo} height={200} width={200} alt="logoImage" />
                            </div>
                        </div>
                    </div>
                    <div className="col-md">
                        <h5>Edit Selected Group</h5>
                        <h3 className="text-dark">{selectedOrgData?.name}</h3>
                        <div className="card bg-light border-success">
                            <div className="mt-2 mx-3">
                                <Formik
                                    enableReinitialize={true}
                                    initialValues={selectedOrgData}
                                    onSubmit={handleSubmit}
                                    validationSchema={groupFormSchema}>
                                    {() => (
                                        <Form>
                                            <Row>
                                                <Col>
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="name">Group Name</label>
                                                        <Field type="text" name="name" className="form-control" />
                                                        <ErrorMessage
                                                            name="name"
                                                            component="div"
                                                            className=".text-error"
                                                        />
                                                    </div>
                                                </Col>
                                                <Col>
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="Headline">Headline</label>
                                                        <Field type="text" name="headline" className="form-control" />
                                                        <ErrorMessage
                                                            name="headline"
                                                            component="div"
                                                            className=".text-error"
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="description">Description</label>
                                                        <Field
                                                            type="text"
                                                            name="description"
                                                            className="form-control"
                                                        />
                                                        <ErrorMessage
                                                            name="description"
                                                            component="div"
                                                            className=".text-error"
                                                        />
                                                    </div>
                                                </Col>
                                                <Col>
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="logoUrl">URL for logo</label>
                                                        <Field type="url" name="logo" className="form-control" />
                                                        <ErrorMessage
                                                            name="logo"
                                                            component="div"
                                                            className=".text-error"
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <label htmlFor="GroupType">Select Group Type</label>
                                            <Field as="select" name="groupType" className="form-control">
                                                <option value="">Select Group Type</option>
                                                {groupTypes?.map(mapGroupType)}
                                            </Field>
                                            <div className="mb-3 mt-3">
                                                <Col className="col-auto left">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-warning chat-send waves-effect waves-light">
                                                        Submit Changes
                                                    </button>
                                                </Col>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default GroupEdit;
