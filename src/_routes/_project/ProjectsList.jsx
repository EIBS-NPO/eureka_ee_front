import React, { useEffect, useState } from 'react';
import {Container, Header, Input, Loader, Menu, Message, Segment} from 'semantic-ui-react'
import projectAPI from "../../_services/projectAPI";
import Card from "../../_components/Card";
import authAPI from "../../_services/authAPI";
import {withTranslation} from "react-i18next";

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
    const [assignProjects, setAssignProjects] = useState()

    const [loader, setLoader] = useState();

    const [ctx, setCtx] = useState("")

    useEffect(() => {
        setLoader(true)
        setCtx( checkCtx() )
        let ctx = checkCtx()
        if(ctx === 'follower'){
            projectAPI.getFollowed()
                .then(response => {
                    console.log(response.data)
                    setProjects(response.data)
                })
                .catch(error => console.log(error.response))
                .finally(() => setLoader(false))
        }
        else if (ctx !== 'public') { //todo gerer le rpojet my (creator + assign)
            projectAPI.get(ctx)
                .then(response => {
                    console.log(response.data)
                    setProjects(response.data)
                    projectAPI.getAssigned()
                        .then(response =>{
                            setAssignProjects(response.data)
                        })
                        .catch(error => {
                            console.log(error)
                        })
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
                title = <h1>{ props.t('my_projects') }</h1>
                break;
            case "follower":
                title = <h1>{ props.t('projects') +" : " + props.t('my_favorites') }</h1>
                break;
            default:
                title = <h1>{ props.t('all_projects') }</h1>
        }
        return title;
    }

    const [activeItem, setActiveItem] = useState('myProjects')
    const handleItemClick = (e, { name }) => setActiveItem(name)

    const [search, setSearch] = useState("")
    const handleSearch = (event) => {
        const value = event.currentTarget.value;
        setSearch(value);
    }

    const filteredList = (list) => {
        return list.filter(p =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.creator.firstname.toLowerCase().includes(search.toLowerCase()) ||
            p.creator.lastname.toLowerCase().includes(search.toLowerCase())
        )
    }

    return (
        <div className="card">
            <Title />
            {ctx === "creator" &&
                <>
                <Segment vertical>
                    <Menu attached='top' tabular>
                        <Menu.Item name='myProjects' active={activeItem === 'myProjects'} onClick={handleItemClick}>
                            <Header>
                                {props.t("my_projects")}
                            </Header>
                        </Menu.Item>
                        <Menu.Item name='myTakingPart' active={activeItem === 'myTakingPart'} onClick={handleItemClick}>
                            <Header>
                                {props.t("my_taking_part")}
                            </Header>
                        </Menu.Item>
                    </Menu>
                </Segment>
                {!loader &&
                    <>
                    {activeItem === 'myProjects' &&
                    <Segment attached='bottom'>
                        <Menu>
                            <Menu.Item position="right">
                                <Input name="search" value={ search ? search : ""}
                                       onChange={handleSearch}
                                       placeholder={  props.t('search') + "..."}    />
                            </Menu.Item>
                        </Menu>
                        {projects && filteredList(projects).length > 0 ?
                        filteredList(projects).map(project => (
                            <Segment key={project.id} raised>
                                <Card history={props.history} key={project.id} obj={project} type="project" isLink={true}
                                      ctx={ctx}/>
                            </Segment>
                        ))
                            :
                            <Container textAlign='center'>
                                <Message size='mini' info>
                                    {props.t("no_result")}
                                </Message>
                            </Container>
                        }
                    </Segment>
                    }

                    {activeItem === 'myTakingPart' &&
                    <Segment attached='bottom'>
                            <Menu>
                                <Menu.Item position="right">
                                    <Input name="search" value={ search ? search : ""}
                                           onChange={handleSearch}
                                           placeholder={  props.t('search') + "..."}    />
                                </Menu.Item>
                            </Menu>
                        {assignProjects && filteredList(assignProjects).length > 0 ?
                        filteredList(assignProjects).map(project => (
                            <Segment key={project.id} raised>
                                <Card history={props.history} key={project.id} obj={project} type="project" isLink={true}
                                      ctx={ctx}/>
                            </Segment>
                        ))
                            :
                            <Container textAlign='center'>
                                <Message size='mini' info>
                                    {props.t("no_result")}
                                </Message>
                            </Container>
                        }
                    </Segment>
                    }
                    </>
                }
                </>
            }

            {ctx !== "creator" && !loader &&
                projects && projects.length > 0 &&
                projects.map( project  => (
                    <Segment key={project.id } raised>
                        <Card history={ props.history } key={project.id} obj={project} type="project" isLink={true} ctx={ctx}/>
                    </Segment>
                ))
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

