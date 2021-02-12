import React, { useEffect, useState } from 'react';
import utilities from "../../_services/utilities";
// the hoc
import { withTranslation } from 'react-i18next';
import projectAPI from "../../_services/projectAPI";
import Project from "../../_components/cards/project";
import fileAPI from "../../_services/fileAPI";
import {Divider, Segment} from "semantic-ui-react";

const GetMyProjects = ({ t }) => {

    const [projects, setProjects] = useState([])

    useEffect(() => {
        projectAPI.get("creator")
            .then(response => {
                console.log(response)
                setProjects(response.data)
            })
            .catch(error => console.log(error.response))
    }, []);

    return (
        <>
            <div className="card">
            <h1>{t('my_projects')}</h1>
            {projects.length > 0 ?
                projects.map(p => (
                    <>
                        <Project key={p.id} project={p} context={"creator"}/>
                        <Divider section />
                    </>
                ))
                :
                    <Segment>
                        <p>{t('no_result')}</p>
                    </Segment>
            }
            </div>
        </>
    );
};

export default withTranslation()(GetMyProjects);

