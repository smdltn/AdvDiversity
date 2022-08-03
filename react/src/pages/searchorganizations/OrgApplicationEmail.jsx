import React, { useState } from 'react';

import debug from 'sabio-debug';
import { useLocation } from 'react-router-dom';

const _logger = debug.extend('OrgApplicationEmail');

function OrgApplicationEmail() {
    const location = useLocation();
    // const mentorData = location.state;
    const [mentorData] = useState(location.state);
    _logger(mentorData);

    return (
        <React.Fragment>
            <div className="container mt-3 mb-3">
                <h1>Thank you for applying. </h1>
                <h2>{mentorData.firstName}</h2>
                <h5>Please check your email for our confirmation</h5>
            </div>
        </React.Fragment>
    );
}

export default OrgApplicationEmail;
