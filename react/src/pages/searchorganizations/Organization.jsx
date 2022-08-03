import React from 'react';
import PropTypes from 'prop-types';
import debug from 'sabio-debug';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as groupServices from '../../services/groupService';
import toastr from 'toastr';

const _logger = debug.extend('Organization');

function Organization(props) {
    const org = props.organization;
    const aOrgData = props.state;
    _logger('Organization data....', { org });

    const onHandleDeleteClicked = (e) => {
        e.preventDefault();
        _logger(org.id);
        groupServices.deleteGroup(org.id).then(onDeleteSucess).catch(onDeleteError);
    };
    const onDeleteSucess = (response) => {
        toastr.success(response);
    };
    const onDeleteError = (err) => {
        toastr.error(err);
    };

    return (
        <React.Fragment>
            <Link to={`${org.id}`} state={aOrgData}>
                <Row>
                    <Col>
                        <div className="col">
                            <h4 className="text-danger">Name: {org.name}</h4>
                            <p>Description: {org.description}</p>
                            <p>Categories: {org.groupType.name}</p>
                        </div>
                    </Col>
                    <Col>
                        <img src={org?.logo} height={150} width={150} alt="logo-Img" />
                    </Col>
                </Row>
            </Link>
            {/* <button>Edit</button> */}
            <Link to={`${org.id}`} state={aOrgData}>
                Edit
            </Link>
            <button className="mx-3" onClick={onHandleDeleteClicked}>
                Delete
            </button>
            <div className="mb-3 text-danger">
                ____________________________________________________________________________________________________
            </div>
        </React.Fragment>
    );
}

Organization.propTypes = {
    organization: PropTypes.shape({
        id: PropTypes.number.isRequired,
        groupTypeId: PropTypes.number,
        name: PropTypes.string.isRequired,
        headline: PropTypes.string,
        description: PropTypes.string.isRequired,
        logo: PropTypes.string,
        createdById: PropTypes.number,
        createdDate: PropTypes.instanceOf,
        modifiedDate: PropTypes.instanceOf,
        groupType: PropTypes.string,
    }),
    state: PropTypes.shape({}),
};

export default Organization;
