import React, { useEffect, useState } from 'react';
import utilities from "../../_services/utilities";
// the hoc
import { withTranslation } from 'react-i18next';
import AuthAPI from "../../_services/authAPI";
import orgAPI from "../../_services/orgAPI";
import fileAPI from "../../_services/fileAPI";
import Organization from "../../_components/cards/organization";
import {Divider, Item, Label} from "semantic-ui-react";

const GetAllOrg = ({ t }) => {

    const [orgs, setOrgs] = useState([])

    useEffect(() => {
        orgAPI.get()
            .then(response => {
                console.log(response)
                setOrgs(response.data)
                response.data.forEach(o => {
                    if (o.picture) {
                        fileAPI.downloadPic("org", o.picture)
                            .then(response => {
                               o.picture = response.data[0]
                                // setPictures64(pictures64 => [...pictures64, { [player.id]: response.data.data }])
                            })
                            .catch(error => console.log(error.response))
                    }
                })
            })
            .catch(error => console.log(error.response))
    }, []);

    return (
        <div className="card">
            <h1>Liste des organizations</h1>
            {orgs.length > 0 ?
                <Item.Group divided>
                    {orgs.map(org => (
                        <Organization key={org.id} org={org}/>
                    ))}
                </Item.Group>
                :
                <p>Aucun projet trouvé</p>
            }
        </div>
    );
};

export default withTranslation()(GetAllOrg);

