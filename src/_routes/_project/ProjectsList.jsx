import React, { useEffect, useState, useContext } from 'react';
import { Loader, Segment} from 'semantic-ui-react'
import { withTranslation } from 'react-i18next';
import projectAPI from "../../_services/projectAPI";
import AuthContext from "../../_contexts/AuthContext";
import Card from "../../_components/Card";

const ProjectsList = ( props ) => {
    const isAuth = useContext(AuthContext).isAuthenticated;

    const urlParams = props.match.params.ctx

    //forbiden if route for my org and no auth
    if (urlParams !=="public" && isAuth === undefined) {
        props.history.replace('/')
    }

    const ctx = () => {
        if (urlParams !=="public" && isAuth === false) {
            //if ctx need auth && have no Auth, public context is forced
            return 'public';
        }
        else {
            return urlParams
        }
    }

    const [projects, setProjects] = useState()

    const [loader, setLoader] = useState();

    useEffect(() => {
        setLoader(true)
        console.log(ctx())
        if (ctx() !== 'public') {
            projectAPI.get(ctx())
                .then(response => {
                    console.log(response)
                    setProjects(response.data)
                })
                .catch(error => console.log(error.response))
                .finally(() => setLoader(false))
        } else {
            projectAPI.getPublic()
                .then(response => {
                    console.log(response)
                    setProjects(response.data)
                })
                .catch(error => console.log(error.response))
                .finally(() => setLoader(false))
        }
    }, [urlParams]);

    return (
        <div className="card">
            {ctx() === "creator" ?
                <h1>{ props.t('my_projects') }</h1>
                :
                <h1>{ props.t('public_projects') }</h1>
            }

            {!loader &&
                <>
                {projects && projects.length > 0 &&
                    projects.map( project  => (
                        <Segment key={project.id } raised>
                            <Card history={ props.history } key={project.id} obj={project} type="project" isLink={true} ctx={ctx()}/>
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

