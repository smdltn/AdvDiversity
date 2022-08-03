import PropTypes from 'prop-types';
import React from 'react';
import '../../components/FAQ/faq.css';
import { Accordion } from 'react-bootstrap';

import debug from 'sabio-debug';

const _logger = debug.extend('AccordianItem');

const AccordionItem = (props) => {
    const { question, answer } = props.faq;
    const index = props.index;
    _logger('AccordianItem is firing... ', index);
    return (
        <Accordion flush>
            <Accordion.Item eventKey={String(props.faq.id)}>
                <Accordion.Header>
                    <h4>{question}</h4>
                </Accordion.Header>
                <Accordion.Body>{answer}</Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
};

export default AccordionItem;

AccordionItem.propTypes = {
    faq: PropTypes.shape({
        id: PropTypes.number.isRequired,
        question: PropTypes.string.isRequired,
        answer: PropTypes.string.isRequired,
    }),
    index: PropTypes.number,
};
