
import React, { useEffect, useState } from 'react';
import {Container, Header, Input, Menu, Message, Segment} from 'semantic-ui-react'
import Card from "../components/Card";
import {withTranslation} from "react-i18next";
import {ContentContainer } from "../components/Loader";
import {HandleGetProjects} from "../../__services/_Entity/projectServices";
import SearchInput from "../components/menus/components/ListFilter";

const ProjectsList = ( props ) => {
    const urlParams = props.match.params.ctx

    const checkCtx = async () => {
        return urlParams
    }

    const [projects, setProjects] = useState([])
    const [assignProjects, setAssignProjects] = useState([])

    const [loader, setLoader] = useState(false);

    const [ctx, setCtx] = useState("")

    //todo
    const [errors, setErrors] = useState("")
    useEffect(async () => {

        async function fetchData(){
            //todo
            checkCtx()
                .then(async (ctx) => {

                    setCtx(ctx)
                        await HandleGetProjects(
                            { access:ctx},
                            setProjects,
                            setLoader,
                            setErrors,
                            props.history
                        )
                    if(ctx === "owned"){ //if ctx owned get assigned too
                        await HandleGetProjects(
                            { access:"assigned"},
                            setAssignProjects,
                            setLoader,
                            setErrors,
                            props.history
                        )
                    }
                })
        }

        fetchData()

        //dismiss unmounted warning
        return () => {
            setProjects({});
            setAssignProjects({});
        };
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
        return list.filter(p =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.creator.firstname.toLowerCase().includes(search.toLowerCase()) ||
            p.creator.lastname.toLowerCase().includes(search.toLowerCase())
        )
    }

    const [projectsFiltered, setProjectsFiltered] = useState([])
    const [projectsPartnersFiltered, setProjectsPartnersFiltered] = useState([])

    return (
        <ContentContainer
            loaderActive={loader}
            loaderMsg={ props.t('loading') +" : " + props.t('projects') }
        >

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
                        <Menu.Item position="right">
                            <SearchInput
                                elementList={ projects }
                                setResultList={ setProjectsFiltered }
                                researchFields={{
                                    main: ["title"],
                                    description:[ props.i18n.language ],
                                    creator: ["firstname", "lastname"]
                                }}
                                isDisabled ={ loader }
                            />
                        </Menu.Item>
                        {projects && projectsFiltered.length > 0 ?
                            projectsFiltered.map(project => (
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
                                    <SearchInput
                                        elementList={ assignProjects }
                                        setResultList={ setProjectsPartnersFiltered }
                                        researchFields={{
                                            main: ["title"],
                                            description:[ props.i18n.language ],
                                            creator: ["firstname", "lastname"]
                                        }}
                                        isDisabled ={ loader }
                                    />
                                </Menu.Item>
                            </Menu>
                        {assignProjects && projectsPartnersFiltered.length > 0 ?
                            projectsPartnersFiltered.map(project => (
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
                    <Menu.Item position="right">
                        <SearchInput
                            elementList={ projects }
                            setResultList={ setProjectsFiltered }
                            researchFields={{
                                main: ["title"],
                                description:[ props.i18n.language ],
                                creator: ["firstname", "lastname"]
                            }}
                            isDisabled ={ loader }
                        />
                    </Menu.Item>
                    {projects && projectsFiltered.length > 0 ?
                        projectsFiltered.map(project => (
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
                </>
            }

        </ContentContainer>
    );
}

export default withTranslation()(ProjectsList);

