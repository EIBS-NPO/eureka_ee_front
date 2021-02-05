import React, { useEffect, useState } from 'react';
import projectAPI from '../../_services/userAPI';
import Project from '../../_components/cards/project';
import {NavLink} from "react-router-dom";
//import AuthContext from '../_contexts/AuthContext';
//import MainMenu from "../_components/MainMenu";

/**
 * la page qui affiche les détail de projet, doit afficher
 * le projet,
 * la liste des followers,
 * la liste des participants
 * les org liées
 * le nombre de resources? ou la liste des resource publiques
 * la liste des reources privées, si abilitation user suffisante.
 */

const ProfilProject = ({ history, id }) => {

    const [project, setProject] = useState()

    useEffect(() => {
        projectAPI.get(id)
            .then(response => {
                setProject(response.data[0])
            })
            .catch(error => console.log(error.response))
    }, []);

    return (

        <div>
            <h1>Fiche de projet</h1>
            {project &&
            (   <>
                    <Project project={project}/>
                </>
            )
            }
        </div>
    );
};

export default ProfilProject;