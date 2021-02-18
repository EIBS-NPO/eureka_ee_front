import React, { useEffect, useState, useContext } from 'react';
import { Loader, Segment} from 'semantic-ui-react'
import { withTranslation } from 'react-i18next';
import projectAPI from "../../_services/projectAPI";
import Project from "../../_components/cards/project";
import AuthContext from "../../_contexts/AuthContext";

const ProjectsList = ( props ) => {
    const isAuth = useContext(AuthContext).isAuthenticated;

    const urlParams = props.match.params.ctx

    const ctx = () => {
        if (urlParams !=="public" && isAuth === false) {
            //if ctx need auth && have no Auth, public context is forced
            console.log('public')
            return 'public';
        }
        else {
            console.log(urlParams)
            return urlParams
        }
    }

    const [projects, setProjects] = useState()

    const [loader, setLoader] = useState();

    useEffect(() => {
        setLoader(true)
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
                    projects.map((p, key) => (
                        <Segment key={key}>
                            <Project project={p} context={ctx()} />
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

