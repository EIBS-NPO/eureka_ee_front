import React, { useEffect, useState } from 'react';
import orgAPI from '../../_services/orgAPI';
import Organization from "../../_components/cards/organization";

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
                        <Organization org={org}/>
                    </>
                )
            }
        </div>
    );
};

export default ProfilOrg;