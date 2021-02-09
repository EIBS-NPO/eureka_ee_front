import React, { useEffect, useState } from 'react';
import { Divider, Item } from 'semantic-ui-react'
import { withTranslation } from 'react-i18next';
import projectAPI from "../../_services/projectAPI";
import Project from "../../_components/cards/project";

const GetAllProjects = ({ props }) => {


    const [projects, setProjects] = useState([])

    useEffect(() => {
        projectAPI.get()
            .then(response => {
                console.log(response)
                setProjects(response.data)
            })
            .catch(error => console.log(error.response))
    }, []);

    return (
        <div className="card">
            <h1>Liste des projets</h1>
            {projects.length > 0 ?
                projects.map((p, key) => (
                    <Item.Group divided key={key}>
                        <Project project={p} context={"all"} />

                        <Divider section />
                    </Item.Group>
                ))
                :
                    <p>Aucun projet trouvé</p>
            }
        </div>
    );
}

export default withTranslation()(GetAllProjects);

