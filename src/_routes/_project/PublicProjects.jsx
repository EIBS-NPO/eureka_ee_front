import React, { useEffect, useState } from 'react';
import { Divider, Item } from 'semantic-ui-react'
import { withTranslation } from 'react-i18next';
import projectAPI from "../../_services/projectAPI";
import Project from "../../_components/cards/project";

const PublicProjects = ({t, props }) => {

    const [projects, setProjects] = useState([])

    useEffect(() => {
        projectAPI.getPublic()
            .then(response => {
                console.log(response)
                setProjects(response.data)
            })
            .catch(error => console.log(error.response))
    }, []);

    return (
        <div className="card">
            <h1>{ t('public_projects') }</h1>
            {projects.length > 0 ?
                projects.map((p, key) => (
                    <>
                        <Project project={p} context={"public"} />
                        <Divider section />
                    </>
                ))
                :
                    <p>{t('no_result')}</p>
            }
        </div>
    );
}

export default withTranslation()(PublicProjects);

