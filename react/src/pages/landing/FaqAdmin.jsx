import React from 'react';
import { useState } from 'react';
import debug from 'sabio-debug';
import CreateFaq from './CreateFaq';
import AllFaqs from './AllFaqs';
import './faqtab.css';
import * as faqsServices from '../../services/faqsServices';

const _logger = debug.extend('FaqAdmin');

const FaqAdmin = () => {
    const [toggleState, setToggleState] = useState(1);
    const [selectedFaq, setSelectedFaq] = useState();
    _logger('FAQAdmin rendering');

    const toggleTab = (index, id) => {
        setToggleState(index);
        if (id !== undefined) {
            faqsServices.getFaqById(id).then(onGetFaqByIdSuccess).catch(onGetFaqByIdError);
        }
    };
    const onGetFaqByIdSuccess = (response) => {
        _logger('onGetFaqById Success...', response.item);
        setSelectedFaq(response.item);
    };
    const onGetFaqByIdError = (error) => {
        _logger('OnGetFaqById Error...', error);
    };
    _logger('selectedFaq...', selectedFaq);

    return (
        <React.Fragment>
            <div className="faq-container container mt-3 bg-light">
                <div className="bloc-tabs container">
                    <div className={toggleState === 1 ? 'tabs active-tabs' : 'tabs'} onClick={() => toggleTab(1)}>
                        {selectedFaq === undefined && <h3>Create New FAQ</h3>}
                        {selectedFaq !== undefined && <h3>Edit</h3>}
                    </div>

                    <div className={toggleState === 2 ? 'tabs active-tabs' : 'tabs'} onClick={() => toggleTab(2)}>
                        <h3>Display All FAQs</h3>
                    </div>
                </div>

                <div className="faq-content-tabs mt-2 mb-2">
                    <div className={toggleState === 1 ? 'faq-content active-content' : 'faq-content'}>
                        {selectedFaq === undefined && <h2>New FAQ</h2>}
                        {selectedFaq !== undefined && <h2>Edit</h2>}
                        <hr />
                        <CreateFaq selectedFaq_={selectedFaq} />
                    </div>
                </div>

                <div className={toggleState === 2 ? 'faq-content active-content' : 'faq-content'}>
                    <div className="faq-content active-content">
                        <h2>All FAQs</h2>
                        <hr />
                        <AllFaqs runToggleTab={toggleTab} />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default FaqAdmin;
