import React, { useEffect, useState } from 'react';
import { Loader, Segment} from 'semantic-ui-react'
import { withTranslation } from 'react-i18next';
import projectAPI from "../../_services/projectAPI";
import Card from "../../_components/Card";
import authAPI from "../../_services/authAPI";

const ProjectsList = ( props ) => {
    const urlParams = props.match.params.ctx

    //forbiden if route for my org and no auth
    const checkCtx = () => {
        if (urlParams !=="public" && !authAPI.isAuthenticated()) {
            //if ctx need auth && have no Auth, public context is forced
            authAPI.logout()
        }else {return urlParams}
    }

    const [projects, setProjects] = useState()

    const [loader, setLoader] = useState();

    const [ctx, setCtx] = useState("")

    useEffect(() => {
        setLoader(true)
        setCtx( checkCtx() )
        let ctx = checkCtx()
        if(ctx === 'follower'){
            projectAPI.getFollowed()
                .then(response => {
                    setProjects(response.data)
                })
                .catch(error => console.log(error.response))
                .finally(() => setLoader(false))
        }
        else if (ctx !== 'public') {
            projectAPI.get(ctx)
                .then(response => {
                    setProjects(response.data)
                })
                .catch(error => console.log(error.response))
                .finally(() => setLoader(false))
        } else {
            projectAPI.getPublic()
                .then(response => {
                    setProjects(response.data)
                })
                .catch(error => console.log(error.response))
                .finally(() => setLoader(false))
        }
    }, [urlParams]);

    const Title = () => {
        let title = ""
        switch(ctx){
            case "creator":
                title = <h1>{ props.t('my_activities') }</h1>
                break;
            case "follower":
                title = <h1>{ props.t('my_favorites') }</h1>
                break;
            default:
                title = <h1>{ props.t('public_activities') }</h1>
        }
        return title;
    }

    return (
        <div className="card">
            <Title />

            {!loader &&
                <>
                {projects && projects.length > 0 &&
                    projects.map( project  => (
                        <Segment key={project.id } raised>
                            <Card history={ props.history } key={project.id} obj={project} type="project" isLink={true} ctx={ctx}/>
                        </Segment>
                    ))
                }
                </>
            }

            {loader &&
            <Segment>
                <Loader
                    active
                    content={
                        <p>{props.t('loading') +" : " + props.t('project') }</p>
                    }
                    inline="centered"
                />
            </Segment>
            }
        </div>
    );
}

export default withTranslation()(ProjectsList);

