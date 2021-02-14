import React from 'react';
import { NavLink } from "react-router-dom";
import {withTranslation} from "react-i18next";

const AnoMenu = ( props ) => {
    return(
        <>
            <nav>
                <ul>
                    <li><NavLink to="/all_projects/public">{ props.t('all_projects') }</NavLink></li>
                    <li><NavLink to="/all_resources/public">{ props.t('all_resources') }</NavLink></li>
                    <li><NavLink to="/all_organizations/public">{ props.t('all_org') }</NavLink></li>
                </ul>
            </nav>
        </>
    );
}

export default withTranslation()(AnoMenu);