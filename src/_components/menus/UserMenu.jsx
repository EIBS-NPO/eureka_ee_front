import React from 'react';
import { NavLink } from "react-router-dom";
import {withTranslation} from "react-i18next";

const UserMenu = ( props ) => {
    return(
        <>
            <nav>
                <ul>
                    <li><NavLink to="/all_activities/creator"> { props.t('my_activities') } </NavLink></li>
                    <li><NavLink to="/all_organizations/my"> { props.t('my_org') } </NavLink></li>
                    <li><NavLink to="/all_projects/creator"> { props.t('my_projects') } </NavLink></li>
                    <li><NavLink to="/all_resources/creator"> { props.t('my_resources') } </NavLink></li>
                </ul>
            </nav>
        </>
    );
}

export default withTranslation()(UserMenu);