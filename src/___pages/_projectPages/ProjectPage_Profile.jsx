import React, {useContext, useEffect, useState} from 'react';
import {Container, Message} from "semantic-ui-react";
import { useTranslation, withTranslation} from "react-i18next";
import AuthContext from "../../__appContexts/AuthContext";
import {HandleGetProjects } from "../../__services/_Entity/projectServices";
import {DisplayProject} from "../components/entityViews/ManageProject";
import {ContentContainer} from "../components/Loader";
import {ProjectHeader} from "../components/entityViews/ProjectViews";

const ProjectPage_Profile = (props) => {
    const { t } = useTranslation()
    const {email, isAuthenticated} = useContext(AuthContext);
    const urlParams = props.match.params.id.split('_')
    const checkCtx = () => {
        if(urlParams[0] === 'public' || urlParams[0] === 'owned' || urlParams[0] === 'assigned'){
            if (urlParams[0] !=="public" && isAuthenticated === false) {
                //if ctx need auth && have no Auth, public context is forced
                props.history.replace('/login')
            } else return urlParams[0]
        }else return '';

    }
    const [ctx, setCtx] = useState("public")

    const [isOwner, setIsOwner] =useState(false)

    const [project, setProject] = useState()

    const [errors, setErrors] = useState("")


    const [loader, setLoader] = useState(true);

    const postTreatment = async (projectResult) => {
        let owner = projectResult[0] && projectResult[0].creator && email === projectResult[0].creator.email
        setIsOwner(owner)
        setProject(projectResult[0])
    }

    //load the project
    useEffect(async() => {
        async function fetchData () {
            let ctx = checkCtx()
            setCtx(ctx)

            await HandleGetProjects(
                {access: ctx, project:{id:urlParams[1]}}, postTreatment, setLoader, setErrors, false, props.history )

        }

        fetchData()

        //dismiss unmounted warning
        return () => {
            setProject({});
        };
    }, []);

    return (
        <ContentContainer
            loaderActive={loader}
            loaderMsg={ props.t('loading') +" : " + props.t('project') }
        >

            {!loader &&
            <>
                {project ?
                    <>
                        <ProjectHeader t={t} ctx={ctx} project={project} setProject={setProject} />
                        <DisplayProject
                            t={t} ctx={ctx}
                            project={project}
                            setProject={setProject}
                            isOwner={isOwner}
                            history={props.history}
                            loader={loader}
                        />
                    </>
                    :
                        <Container textAlign='center'>
                            <Message size='mini' info>
                                {props.t("no_result")}
                            </Message>
                        </Container>
                    }
                </>
                }
        </ContentContainer>
    );
};

export default withTranslation()(ProjectPage_Profile);