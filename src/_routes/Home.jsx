
import React from 'react';
import utilities from "../_services/utilities";
import { withTranslation } from 'react-i18next';

const Home = ({ t }) => {

    return (
        <div className="App">
            <h1>{utilities.strUcFirst(t('Welcome'))}</h1>
        </div>
    );
};

export default withTranslation()(Home);

