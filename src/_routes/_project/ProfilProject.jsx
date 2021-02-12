import React, { useEffect, useState } from 'react';
import projectAPI from '../../_services/projectAPI';
import Project from '../../_components/cards/project';
import { Loader } from "semantic-ui-react";
import {withTranslation} from "react-i18next";

/**
 * la page qui affiche les détail de projet, doit afficher
 * le projet,
 * la liste des followers,
 * la liste des participants
 * les org liées
 * le nombre de resources? ou la liste des resource publiques
 * la liste des reources privées, si abilitation user suffisante.
 */

const ProfilProject = (props) => {

    const urlParams = props.match.params.id.split('_')

    const [project, setProject] = useState()

    const [loader, setLoader] = useState(true);

    useEffect(() => {
        console.log("1")
        console.log(urlParams)
        if(urlParams[0] === 'public'){
            console.log("2")
            projectAPI.getPublic(urlParams[1])
                .then(response => {
                    console.log("3")
                    console.log(response.data[0])
                    setProject(response.data[0])
                })
                .catch(error => console.log(error.response))
                .finally(()=>setLoader(false))
        }else {
            console.log("4")
            projectAPI.get(urlParams[0], urlParams[1])
                .then(response => {
                    console.log("5")
                    console.log(response.data[0])
                    setProject(response.data[0])
                })
                .catch(error => console.log(error.response))
                .finally(()=>setLoader(false))
        }
    }, []);

    return (

        <div className="card">
            <h1>Fiche de projet</h1>
            {!loader &&
                <>
                {project !== "DATA_NOT_FOUND" ?
                    <>
                        <Project project={project} context={urlParams[0]}/>
                    </>
                :
                    <>
                        <p>{ props.t('no_result') }</p>
                    </>
                }
                </>
            }
            {loader &&
                <Loader active inline="centered"/>
            }
        </div>
    );
};

export default withTranslation()(ProfilProject);