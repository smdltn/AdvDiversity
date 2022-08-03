import AccordionItem from "./AccordionItem";
import React from "react";
import { Row, Col, Accordion } from "react-bootstrap";
import PropTypes from "prop-types";
import classNames from "classnames";
import debug from "sabio-debug";

const _logger = debug.extend("Accordion");

const AccordionComponent = (props) => {
  _logger(props);
  const allFaqs = props.arrayOfFaqs;
  const isShown = props.state;
  const lastPage = props.isLastPage;
  _logger("Accordion is firing...", isShown);
  _logger("Accordian is firing, allFaqs...", allFaqs);
  const mapFaq = (faq, index) => {
    return (
      <Row
        className="mt-6"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        key={index}
      >
        <Col key={faq.id} lg={{ span: 8 }}>
          <AccordionItem key={faq.id} faq={faq} index={index} />
        </Col>
      </Row>
    );
  };
  return (
    <Row className="accordion">
      {allFaqs?.map(mapFaq)}

      {isShown === "showAll" && lastPage && (
        <Row
          className="mt-6"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Col key="emailFaq" lg={{ span: 8 }}>
            <Accordion flush>
              <Accordion.Item eventKey="emailFaq">
                <Accordion.Header>
                  <h4 className={classNames("", "Cannot find your answer?")}>
                    Cannot find your answer?
                  </h4>
                </Accordion.Header>
                <Accordion.Body>
                  <button
                    type="button"
                    className="btn btn-success btn-sm mt-2"
                    onClick={props.activateModal}
                  >
                    Email us your question
                  </button>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      )}
    </Row>
  );
};

export default AccordionComponent;

AccordionComponent.propTypes = {
  arrayOfFaqs: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired,
    })
  ),
  state: PropTypes.string.isRequired,
  activateModal: PropTypes.func.isRequired,
  isLastPage: PropTypes.bool.isRequired,
};
