import React, { useEffect, useState } from 'react';
import utilities from "../../_services/utilities";
// the hoc
import { withTranslation } from 'react-i18next';
import AuthAPI from "../../_services/authAPI";
import orgAPI from "../../_services/orgAPI";
import Organization from "../../_components/cards/organization";

const GetAllOrg = ({ t }) => {

    const [orgs, setOrgs] = useState([])

    useEffect(() => {
        orgAPI.get()
            .then(response => {
                console.log(response)
                setOrgs(response.data)
            })
            .catch(error => console.log(error.response))
    }, []);

    return (
        <>
            <h1>Organisations</h1>
            {orgs.length > 0 ?
                orgs.map(org => (
                    <Organization key={org.id} org={org} className="card"/>
                ))
                :   <div className="card">
                        <p>Aucune Organisation trouvée</p>
                    </div>
            }
        </>
    );
};

export default withTranslation()(GetAllOrg);
