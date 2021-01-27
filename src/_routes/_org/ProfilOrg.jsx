import React, { useEffect, useState } from 'react';
import orgAPI from '../../_services/userAPI';
import {NavLink} from "react-router-dom";
//import AuthContext from '../_contexts/AuthContext';
//import MainMenu from "../_components/MainMenu";

const ProfilOrg = ({ history, id }) => {

    const [org, setOrg] = useState()

    useEffect(() => {
        orgAPI.get(id)
            .then(response => {
                setOrg(response.data[0])
            })
            .catch(error => console.log(error.response))
    }, []);
    return (

        <div>
            <h1>Fiche d'organisation</h1>
            {org &&
            (   <>
                    <p>{org.name}</p>
                    <p>{org.type}</p>
                    <p>{org.email}</p>
                    <p>{org.phone}</p>

                    <NavLink to="/UpdateOrg">Update</NavLink>
                </>
            )
            }
        </div>
    );
};

export default ProfilOrg;