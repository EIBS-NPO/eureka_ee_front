import React, { useEffect, useState } from 'react';
import utilities from "../../_services/utilities";
// the hoc
import { withTranslation } from 'react-i18next';
import projectAPI from "../../_services/projectAPI";
import Project from "../../_components/cards/project";

const GetAllProjects = ({ t }) => {

    const [projects, setProjects] = useState([])

    useEffect(() => {
        projectAPI.getMy()
            .then(response => {
                console.log(response)
                setProjects(response.data)
            })
            .catch(error => console.log(error.response))
    }, []);

    return (
        <>
            <h1>Mes projets</h1>
            {projects.length > 0 ?
                projects.map(p => (
                    <Project key={p.id} project={p} context={"creator"}/>
                ))
                :   <div className="card">
                    <p>Aucun projet trouvé</p>
                </div>
            }
        </>
    );
};

export default withTranslation()(GetAllProjects);

