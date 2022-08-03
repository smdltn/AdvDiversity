import React from 'react';
import { Row, Col, Button, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import './faqtab.css';
import * as faqsServices from '../../services/faqsServices';
import PropTypes from 'prop-types';
import debug from 'sabio-debug';

const _logger = debug.extend('AllFaqs');

const AllFaqs = (props) => {
    const [allArrayOfFaqs, setAllarrayOfFaqs] = useState([]);

    const mapFaqs = (ques, index) => {
        false && _logger('mapping', ques);
        return (
            <Row>
                <Col key={'key_' + index}>
                    <div className="container grid" key={'faqA_' + ques.id}>
                        <ul className="list-group" key={'faqA_' + ques.id}>
                            <h5>
                                {ques.id}. {ques.question}
                            </h5>
                            {ques.answer}
                            <div className="mb-2 mt-2">
                                <Button
                                    className="btn btn-warning mx-2"
                                    id={ques.id}
                                    onClick={handleModifyButtonClicked}>
                                    Modify
                                </Button>
                                <Button className="btn-danger" onClick={handleShow} id={ques.id}>
                                    Delete
                                </Button>
                            </div>
                        </ul>
                    </div>
                </Col>
                <div>_____________________________________________________________________________________________</div>
            </Row>
        );
    };

    const handleModifyButtonClicked = (e) => {
        e.preventDefault();
        setOwner(e.target.id);
        _logger('Edit Modal activated...', e.target.id);
        props.runToggleTab(1, e.target.id);
    };

    useEffect(() => {
        faqsServices.getFaqs().then(onSuccess).catch(onError);
    }, []);

    const onSuccess = (data) => {
        _logger('this is firing ', data.item);
        let newFaqs = data.item;
        _logger('arrayOfFaqs is firing ', newFaqs);

        setAllarrayOfFaqs(newFaqs);
    };

    const onError = (err) => {
        _logger('Get All Faqs Error...', err);
    };
    const [modalOpen, setModalOpen] = useState(false);
    const [owner, setOwner] = useState();

    const handleShow = (e) => {
        _logger('delete clicked...', e.target);
        setOwner(e.target.id);
        setModalOpen(() => {
            return true;
        });
    };
    const closeModal = (e) => {
        _logger('closeModal is firing', e);
        setModalOpen(() => {
            return false;
        });
    };

    const hideModal = () => {
        setModalOpen(() => {
            return false;
        });
    };
    const onModalConfirmClicked = (e) => {
        e.preventDefault();
        _logger(owner);

        faqsServices.deleteFaqById(owner).then(onDeleteSuccess).catch(onDeleteError);
    };
    const onDeleteSuccess = (response) => {
        _logger('On Delete Success: ', response);
        closeModal();
        faqsServices.getFaqs().then(onSuccess).catch(onError);
    };
    const onDeleteError = (error) => {
        _logger('Delete Error: ', error);
    };

    return (
        <React.Fragment>
            <Modal show={modalOpen} onHide={hideModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>Please confirmation if you want to delete the question {owner}</Modal.Body>
                <Modal.Footer>
                    <Button className="btn-secondary" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button className="btn-danger" onClick={onModalConfirmClicked}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
            <div>
                <Row>{allArrayOfFaqs?.map(mapFaqs)}</Row>
            </div>
        </React.Fragment>
    );
};

export default AllFaqs;

AllFaqs.propTypes = {
    runToggleTab: PropTypes.func.isRequired,
};
