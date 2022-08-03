import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import debug from 'sabio-debug';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import * as Yup from 'yup';
import * as groupServices from '../../services/groupService';
import toastr from 'toastr';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
// import usersServices from '../../services/usersServices';

const _logger = debug.extend('BecomeAMentor');

const basicSchema = Yup.object().shape({
    firstName: Yup.string().min(2).max(50).required('First Name Is Required'),
    lastName: Yup.string().min(2).max(50).required('Last Name Is Required'),
    email: Yup.string().email('Invalid Email').required('Email Is Required'),
    zipCode: Yup.string().min(5).max(5).required('Zip Code Is Required'),
    phone: Yup.string().min(10).max(11).required('Phone Number Is Required'),
});

function BecomeAMentor() {
    // const userPayload = { email: 'chicken1@email.com', password: 'Password1!' };
    // useEffect(() => {
    //     usersServices.login(userPayload).then().catch();
    // });
    const distances = [
        { id: 5, name: '5 miles' },
        { id: 10, name: '10 miles' },
        { id: 15, name: '15 miles' },
        { id: 25, name: '25 miles' },
    ];
    const [state, setState] = useState({
        formData: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'advDiversity@dispostable.com',
            zipCode: '12345',
            distanceId: 0,
            checkBoxes: [],
            phone: '1234567890',
            phoneCheckBoxes: [],
            purposeRadio: '',
        },
    });
    const navigate = useNavigate();
    const mapDistance = (distance) => {
        return (
            <option value={distance.id} key={`distance_${distance.id}`}>
                {distance.name}
            </option>
        );
    };

    const handleSubmit = (values) => {
        _logger(values);
        const emailPayload = values;
        _logger('emailPayload....', emailPayload);
        groupServices
            .orgConfirmationEmail(emailPayload)
            .then(onConfirmationEmailSuccess)
            .catch(onConfirmationEmailError);
    };
    const onConfirmationEmailSuccess = (response) => {
        _logger(response);
        onSendEmailSuccessAlert();
    };
    const onConfirmationEmailError = (error) => {
        _logger(error);
        toastr.error(error);
    };
    const onSendEmailSuccessAlert = () => {
        swal({
            title: 'Application confirmation',
            text: 'Please check your inbox for our confirmation email. Now, you can check out our current partners',
            icon: 'success',
            confirmButtonText: 'OK',
        }).then(() => {
            navigate('/searchorganizations', { state: state.formData });
        });
    };
    const handleChange = (e) => {
        e.preventDefault();
        const formValue = e.target.value;
        const formField = e.target.name;
        setState((prevState) => {
            let pd = { ...prevState };
            pd.formData[formField] = formValue;

            return pd;
        });
        _logger('formData....', state.formData);
    };

    return (
        <React.Fragment>
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="col-md-6 col-md-offset-2">
                    <h1 className="text-danger" style={{ display: 'flex', justifyContent: 'center' }}>
                        START HERE
                    </h1>
                    <div className="card bg-light border-success">
                        <div className="mt-3 mx-3">
                            <Formik
                                enableReinitialize={true}
                                initialValues={state.formData}
                                onSubmit={handleSubmit}
                                validationSchema={basicSchema}>
                                {() => (
                                    <Form>
                                        <Row>
                                            <Col>
                                                <div className="form-group mb-3">
                                                    <label htmlFor="firstName">First Name</label>
                                                    <Field
                                                        type="text"
                                                        name="firstName"
                                                        className="form-control"
                                                        onChange={handleChange}
                                                    />
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
                                                    <Field
                                                        type="text"
                                                        name="lastName"
                                                        className="form-control"
                                                        onChange={handleChange}
                                                    />
                                                    <ErrorMessage
                                                        name="lastName"
                                                        component="div"
                                                        className=".text-error text-danger"
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
                                                        className=".text-error text-danger"
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
                                                        className=".text-error text-danger"
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
                                                                value="call"
                                                            />
                                                            Call
                                                        </label>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <div className="form-group mb-3">
                                                <label htmlFor="zipCode">Zip Code</label>
                                                <Field type="text" name="zipCode" className="form-control" />
                                                <ErrorMessage
                                                    name="zipCode"
                                                    component="div"
                                                    className=".text-error text-danger"
                                                />
                                            </div>
                                        </Row>
                                        <div className="form-group mb-3">
                                            <label htmlFor="zipCode">Distance</label>
                                            <Field component="select" name="distanceId" className="form-control mb-3">
                                                <option value="">Select distance</option>
                                                {distances.map(mapDistance)}
                                            </Field>
                                        </div>
                                        <Row>
                                            <Col>
                                                <Row>
                                                    <div className="form-group mb-3">
                                                        <div id="my-radio-group mb-2">What are you looking to do?</div>
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
                                            </Col>
                                            <Col>
                                                <div role="group" aria-labelledby="checkbox-group">
                                                    <div className="mb-1">Mentorship base</div>
                                                    <Row className="mb-1">
                                                        <label>
                                                            <Field
                                                                type="checkbox"
                                                                name="checkBoxes"
                                                                value="Community-based"
                                                            />
                                                            Community-based
                                                        </label>
                                                    </Row>
                                                    <Row className="mb-1">
                                                        <label>
                                                            <Field
                                                                type="checkbox"
                                                                name="checkBoxes"
                                                                value="Site-based"
                                                            />
                                                            Site-based
                                                        </label>
                                                    </Row>
                                                    <Row className="mb-3">
                                                        <label>
                                                            <Field
                                                                type="checkbox"
                                                                name="checkBoxes"
                                                                value="virtual-based"
                                                            />
                                                            Virtual-based
                                                        </label>
                                                    </Row>
                                                </div>
                                            </Col>
                                        </Row>
                                        <div className="mb-3">
                                            <Col className="col-auto">
                                                <button
                                                    type="submit"
                                                    className="btn btn-warning chat-send waves-effect waves-light">
                                                    Submit
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
        </React.Fragment>
    );
}
export default BecomeAMentor;
