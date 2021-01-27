import React from 'react';
import '../../scss/components/cardOrg.scss';

// the hoc
import { withTranslation } from 'react-i18next';
import {NavLink} from "react-router-dom";

const Organiazation = ({ t, org, context}) => {

    return (
        <div className="card">
            <p>{org.name}</p>
            <p>{org.type}</p>
            <p>{org.email}</p>
            {context === "referent" && (
                <NavLink to={"/update_org/" + org.id }>Update</NavLink>
            )}
        </div>
    );
};

export default withTranslation()(Organiazation);

