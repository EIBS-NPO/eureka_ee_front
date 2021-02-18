
import React from 'react';
import { withTranslation } from 'react-i18next';

const Beweging = ({ t }) => {

    return (
        <div className="card">
            <h1>Beweging</h1>
            <div>
                <p>
                    {t('pre_beweging')}
                </p>
            </div>
        </div>
    );
};

export default withTranslation()(Beweging);

