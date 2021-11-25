
import React, {useState} from "react";
import { Loader, Segment} from "semantic-ui-react";
import PictureForm from "../components/forms/picture/PictureForm";
import {withTranslation} from "react-i18next";
import {checkProjectFormValidity, HandleCreateProject} from "../../__services/_Entity/projectServices";
import {CreateProjectForm} from "../components/entityForms/ProjectForms";


const CreateProject = ({ history, t }) => {

    const [loader, setLoader] = useState(false)

    const [project, setProject] = useState( {
        picture: undefined,
        title: "",
        description: {
            "en-GB":"",
            "fr-FR":"",
            "nl-BE":""
        },
        startDate: "",
        endDate: ""
    })

    const [errors, setErrors] = useState({
        picture: "",
        description: "",
        name: "",
        type: "",
        email: "",
        phone: "",
    });

    const postTreatment = ( projectResult ) => {
        history.replace("/project/owned_" + projectResult.id)
    }
    const preSubmit = ( newProject ) => {

        //todo checkFormValidity
        if(checkProjectFormValidity( newProject, setErrors )){
            HandleCreateProject(newProject, postTreatment, setLoader, setErrors, history)
        }
    }

    return (
        <div className="card">
            <h1> {t('new_project')} </h1>
            {!loader &&
            <>
                <Segment>
                    <PictureForm entityType="project" entity={project} setter={setProject} />
                </Segment>

                <CreateProjectForm project={project} setProject={setProject} handleSubmit={preSubmit}
                                   errors={errors} loader={loader}
                />
            </>

            }
            {loader &&
            <Segment>
                <Loader
                    active
                    content={
                        <p>{t('loading') +" : " + t('creation') }</p>
                    }
                    inline="centered"
                />
            </Segment>
            }
        </div>
    )
};

export default withTranslation()(CreateProject);