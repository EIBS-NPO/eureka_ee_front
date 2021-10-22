import React, { useEffect, useState } from 'react';
import {Container, Header, Input, Loader, Menu, Message, Segment} from 'semantic-ui-react'
import projectAPI from "../../__services/_API/projectAPI";
import Card from "../components/Card";
import authAPI from "../../__services/_API/authAPI";
import {withTranslation} from "react-i18next";

const ProjectsList = ( props ) => {
    const urlParams = props.match.params.ctx

    const checkCtx = async () => {
        return urlParams
    }

    const [projects, setProjects] = useState([])
    const [assignProjects, setAssignProjects] = useState([])

    const [loader, setLoader] = useState();

    const [ctx, setCtx] = useState("")

    useEffect(async () => {
        setLoader(true)
        checkCtx()
            .then(async (ctx) => {
                setCtx(ctx)
                if(ctx === 'public'){
                    let response = await projectAPI.getPublic()
                        .catch(error => console.log(error.response))
                    if(response.status === 200){
                        setProjects(response.data)
                    }
                }else {
                    if(await (authAPI.isAuthenticated())){
                        let response = await projectAPI.getProject(ctx)
                            .catch(error => console.log(error.response))
                        if(response && response.status === 200){
                            setProjects(response.data)
                        }

                        if(ctx === 'owned'){ // assigned project for myProject page
                            let response = await projectAPI.getProject("assigned")
                                .catch(error => console.log(error.response))
                            if(response && response.status === 200){
                                console.log(response.data)
                                setAssignProjects(response.data)
                            }
                        }
                    }else {
                        authAPI.logout()
                        props.history.replace("/")
                    }

                }
            })

        setLoader(false)
    }, [urlParams]);

    const Title = () => {
        let title = ""
        switch(ctx){
            case "owned":
                title = <h1>{ props.t('my_projects') }</h1>
                break;
            case "followed":
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
     //   console.log(list)
        return list.filter(p =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.creator.firstname.toLowerCase().includes(search.toLowerCase()) ||
            p.creator.lastname.toLowerCase().includes(search.toLowerCase())
        )
    }

    return (
        <div className="card">
            <Title />
            {ctx === "owned" &&
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
                                       placeholder={  props.t('search') + "..."}
                                />
                            </Menu.Item>
                        </Menu>
                        {projects && filteredList(projects).length > 0 ?
                        filteredList(projects).map(project => (
                            <Segment key={project.id} raised>
                                <Card history={props.history}
                                      key={project.id}
                                      obj={project}
                                      type="project"
                                      isLink={true}
                                      ctx='owned'/>
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
                                <Card history={props.history}
                                      key={project.id}
                                      obj={project}
                                      type="project"
                                      isLink={true}
                                      ctx="assigned"/>
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

            {ctx !== "owned" && !loader &&
                <>
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
                            <Card history={props.history}
                                  key={project.id}
                                  obj={project}
                                  type="project"
                                  isLink={true}
                                  ctx={ctx}
                            />
                        </Segment>
                    ))
                    :
                        <Container textAlign='center'>
                            <Message size='mini' info>
                                {props.t("no_result")}
                            </Message>
                        </Container>
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

