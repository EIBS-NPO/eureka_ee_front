import React from 'react';
import '../../scss/components/footer.scss';

// the hoc
import { withTranslation } from 'react-i18next';
import {NavLink} from "react-router-dom";

const Footer = ({ t }) => {

    return (
        <div className="footer">
            <nav>
                <ul>
                    <li><NavLink to="/beweging">Beweging</NavLink></li>
                </ul>
            </nav>
        </div>
    );
};

export default withTranslation()(Footer);

