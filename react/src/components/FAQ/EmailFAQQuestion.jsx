import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Col, Row } from 'react-bootstrap';
import debug from 'sabio-debug';
import swal from 'sweetalert';
import emailFAQQuestionSchema from '../../schema/emailFAQQuestionSchema';
import * as faqServices from '../../services/faqsServices';
import PropTypes from 'prop-types';

const _logger = debug.extend('EmailFAQQuestion');

const EmailFAQQuestion = (props) => {
    const [faqForm, setFAQForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        faqContent: '',
        terms: false,
    });
    const handleSubmit = (values) => {
        _logger(values);
        setFAQForm((prevState) => {
            let pd = { ...prevState };
            pd = values;

            return pd;
        });

        faqServices.sendFaqEmails(values).then(onSendFaqSuccess).catch(onSendFaqError);
    };
    const onSendFaqSuccess = (response) => {
        _logger(response);
        swal({
            title: 'Email sent confirmation',
            text: 'Please check your inbox for our confirmation email.',
            icon: 'success',
            confirmButtonText: 'OK',
        }).then(() => {
            props.modalState();
        });
    };
    const onSendFaqError = (error) => {
        _logger(error);
    };
    return (
        <React.Fragment>
            <Formik validationSchema={emailFAQQuestionSchema} onSubmit={handleSubmit} initialValues={faqForm}>
                {({ values }) => (
                    <Form>
                        <Row>
                            <Col>
                                <div className="form-group mb-3">
                                    <label htmlFor="firstName">First Name</label>
                                    <Field type="text" name="firstName" className="form-control" placeholder="John" />
                                    <ErrorMessage
                                        name="firstName"
                                        component="div"
                                        className=".text-error text-danger"
                                    />
                                </div>
                            </Col>
                            <Col>
                                <div className="form-group mb-3">
                                    <label htmlFor="lastName">Last Name</label>
                                    <Field type="text" name="lastName" className="form-control" placeholder="Doe" />
                                    <ErrorMessage name="lastName" component="div" className=".text-error text-danger" />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <div className="form-group mb-3">
                                <label htmlFor="email">Email</label>
                                <Field type="email" name="email" className="form-control" placeholder="you@email.com" />
                                <ErrorMessage name="email" component="div" className=".text-error text-danger" />
                            </div>
                        </Row>
                        <Row>
                            <div className="form-group mb-3">
                                <label htmlFor="subject">Subject</label>
                                <Field
                                    type="text"
                                    name="subject"
                                    className="form-control"
                                    placeholder="Email's subject here"
                                />
                                <ErrorMessage name="subject" component="div" className=".text-error text-danger" />
                            </div>
                        </Row>
                        <Row>
                            <div className="form-group mb-3">
                                <label htmlFor="text">Your Question</label>
                                <Field
                                    type="textarea"
                                    component="textarea"
                                    name="faqContent"
                                    className="form-control"
                                    rows="6"
                                />
                                <ErrorMessage name="faqContent" component="div" className=".text-error text-danger" />
                            </div>
                        </Row>
                        <Row>
                            <Row className="mb-2">
                                <div>
                                    <Field type="checkbox" name="terms" />
                                    <label htmlFor="terms" className="checkboxes">
                                        &nbsp;I agree to <a href="privacy"> terms and conditions</a>
                                    </label>
                                </div>
                            </Row>
                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="btn btn-warning chat-send waves-effect waves-light"
                                    disabled={!values.terms}>
                                    Submit
                                </button>
                            </div>
                        </Row>
                    </Form>
                )}
            </Formik>
        </React.Fragment>
    );
};

export default EmailFAQQuestion;

EmailFAQQuestion.propTypes = {
    modalState: PropTypes.func.isRequired,
};
