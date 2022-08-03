import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import debug from 'sabio-debug';
import * as groupServices from '../../services/groupService';
import toastr from 'toastr';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import * as Yup from 'yup';
import { Col, Row } from 'react-bootstrap';

const basicSchema = Yup.object().shape({
    firstName: Yup.string().min(2).max(50).required('Is Required'),
    lastName: Yup.string().min(2).max(50).required('Is Required'),
    email: Yup.string().email('Invalid Email').required('Is Required'),
    zipCode: Yup.string().min(5).max(5).required('Is Required'),
    phone: Yup.string().min(10).max(11).required('Is Required'),
});

const _logger = debug.extend('OrgInDetail');

function OrgInDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const mentorData = location.state;
    _logger(mentorData);

    const [selectedOrgData, setSelectedOrgData] = useState();

    useEffect(() => {
        groupServices.getGroupById(mentorData.id).then(onGetGroupByIdSuccess).catch(onGetGroupByIdError);
    }, []);

    const onGetGroupByIdSuccess = (data) => {
        false && _logger(data);
        let aGroupData = data.item;
        setSelectedOrgData((prevState) => {
            let od = { ...prevState };
            od = aGroupData;

            return od;
        });
    };
    _logger(selectedOrgData?.name);

    const onGetGroupByIdError = (error) => {
        _logger(error);
        toastr.err('message', error);
    };
    const onHandleSubmit = (values) => {
        _logger(values);
        navigate('/searchorganizations/applicationemailconfirmation');
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
                        <h5>Apply to this program</h5>
                        <h3 className="text-dark">{selectedOrgData?.name}</h3>
                        <div className="card bg-light border-success">
                            <div className="mt-2 mx-3">
                                <Formik
                                    enableReinitialize={true}
                                    initialValues={mentorData.data}
                                    onSubmit={onHandleSubmit}
                                    validationSchema={basicSchema}>
                                    {() => (
                                        <Form>
                                            <Row>
                                                <Col>
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="firstName">First Name</label>
                                                        <Field type="text" name="firstName" className="form-control" />
                                                        <ErrorMessage
                                                            name="firstName"
                                                            component="div"
                                                            className=".text-error"
                                                        />
                                                    </div>
                                                </Col>
                                                <Col>
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="lastName">Last Name</label>
                                                        <Field type="text" name="lastName" className="form-control" />
                                                        <ErrorMessage
                                                            name="lastName"
                                                            component="div"
                                                            className=".text-error"
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="email">Email</label>
                                                        <Field type="text" name="email" className="form-control" />
                                                        <ErrorMessage
                                                            name="email"
                                                            component="div"
                                                            className=".text-error"
                                                        />
                                                    </div>
                                                </Col>
                                                <Col>
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="phone">Phone Number</label>
                                                        <Field type="text" name="phone" className="form-control" />
                                                        <ErrorMessage
                                                            name="phone"
                                                            component="div"
                                                            className=".text-error"
                                                        />
                                                    </div>
                                                    <Row>
                                                        <Col xs lg="3">
                                                            <label>
                                                                <Field
                                                                    type="checkbox"
                                                                    name="phoneCheckBoxes"
                                                                    value="text"
                                                                />
                                                                Text
                                                            </label>
                                                        </Col>
                                                        <Col xs lg="4">
                                                            <label>
                                                                <Field
                                                                    type="checkbox"
                                                                    name="phoneCheckBoxes"
                                                                    value="sms"
                                                                />
                                                                SMS
                                                            </label>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <div className="form-group mb-3">
                                                    <div id="my-radio-group">What are you looking to do?</div>
                                                    <div role="group" aria-labelledby="my-radio-group">
                                                        <Row>
                                                            <label>
                                                                <Field
                                                                    type="radio"
                                                                    name="purposeRadio"
                                                                    value="becomeMentor"
                                                                />
                                                                Become a Mentor
                                                            </label>
                                                        </Row>
                                                        <Row>
                                                            <label>
                                                                <Field
                                                                    type="radio"
                                                                    name="purposeRadio"
                                                                    value="findMentor"
                                                                />
                                                                Find a Mentor for myself or someone else
                                                            </label>
                                                        </Row>
                                                    </div>
                                                </div>
                                            </Row>
                                            <div className="mb-3">
                                                <Col className="col-auto left">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-warning chat-send waves-effect waves-light">
                                                        Apply to This Program
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

export default OrgInDetail;
