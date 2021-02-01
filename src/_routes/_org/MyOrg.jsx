import React, { useEffect, useState, useContext } from 'react';
import utilities from "../../_services/utilities";
// the hoc
import { withTranslation } from 'react-i18next';
import orgAPI from "../../_services/orgAPI";
import Organization from "../../_components/cards/organization";
import AuthAPI from "../../_services/authAPI";
import AuthContext from "../../_contexts/AuthContext";

const GetAllOrg = ({ history, t }) => {
    AuthAPI.setup();
    const isAuthenticated = useContext(AuthContext);
    if (isAuthenticated === true) {
        history.replace('/');
    }

    const [orgs, setOrgs] = useState([])

    useEffect(() => {
        orgAPI.getMy()
            .then(response => {
              //  console.log(response)
                setOrgs(response.data)
            })
            .catch(error => console.log(error.response))
    }, []);

    return (
        <>
            <h1>Organisations</h1>
            {orgs.length > 0 ?
                orgs.map(org => (
                    <Organization key={org.id} org={org} context="referent"/>
                ))
                :   <div className="card">
                    <p>Aucune Organisation trouvée</p>
                </div>
            }
        </>
    );
};

export default withTranslation()(GetAllOrg);

