
import {useTranslation, withTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import projectAPI from "../../../../__services/_API/projectAPI";
import {
    Segment,
    Dropdown,
    Form,
    Grid,
    Input,
    Menu,
    Message,
    Radio,
    Container,
    Loader, Item, Label
} from "semantic-ui-react";
import Picture from "../__CommonComponents/Picture";
import Modal from "../__CommonComponents/Modal";
import ProjectForm from "./ProjectForm";
import MultiSelect from "../__CommonComponents/forms/MultiSelect";
import adminAPI from "../../../../__services/_API/adminAPI";

const AdminProjects = ( ) => {

    const { t,  i18n } = useTranslation()

    const [loader, setLoader] = useState( false)
    const [selectedProject, setSelectedProject] = useState(undefined)

    const [projects, setProjects] = useState([])
    const [error, setError] =useState("")



    useEffect( ( ) => {
        setLoader(true)
        adminAPI.getProject()
            .then(response => {

                setProjects(response.data)
            })
            .catch(error => {
                console.log(error);
                setError(error.response.data)
            })
            .finally( () => setLoader(false))
    }, [])

    const lg = i18n.language
    function getTranslate(p, typeText) {
        if(p[typeText]){
            if(p[typeText][lg]) {
                return p[typeText][lg]
            }else if(p[typeText]['en-GB'] && p[typeText]['en'].length !== 0 ) {
                return p[typeText]['en-GB']
            }else {
                return t('no_' + lg + "_" + typeText)
            }
        }else {
            return t('no_' + lg + "_" + typeText )
        }
    }

    const handChange = (event, {value}) => {
        //  let  value  = event.currentTarget;
        let project = projects.find(o => o.id === value)
        setSelectedProject(project);
    }

    const [search, setSearch] = useState("")
    const handleSearch = (event) => {
        const value = event.currentTarget.value;
        setSearch(value);
    }

    /**
     * problème sur la description qui varie selon le langage
     * @type {*[]}
     */
    const filteredList = projects.filter(e =>
        e.title.toLowerCase().includes(search.toLowerCase())
        || getTranslate(e, "description").toLowerCase().includes(search.toLowerCase())
        || e.creator.firstname.toLowerCase().includes(search.toLowerCase())
        || e.creator.firstname.toLowerCase().includes(search.toLowerCase())
        || (e.organization && e.organization.name.toLowerCase().includes(search.toLowerCase()))
        || (!e.organization && ("no_"+t("organization")).toLowerCase().includes(search.toLowerCase()))
    )

    const [loader2, setLoader2] = useState(false)
    const [actionSelected, setActionSelected] = useState(undefined)
    const [show, setShow] = useState(false)
    const handleAction = ( type, p ) => {
        setSelectedProject(p)
        setActionSelected(type)
        setShow(true)
        //    setLoader2(true)
    }

    const cancelForm = (e) => {
        e.preventDefault()
        hideModal()
    }

    const hideModal = () => {
        setShow(false)
        setActionSelected(undefined)
        setSelectedProject(undefined)
        setLoader2(false)
    }

    const handleEditProject = (updatedProject) => {
        let index = projects.indexOf(projects.find(o => o.id === updatedProject.id))
        projects.splice(index, 1, updatedProject);

        hideModal()
    }

    const optionsProjects = () => {
        let options = []
        projects.map((p, key) => {
            options.push({key:p.id, value:p.id, text: p.id + " " + p.title + " " })
        })
        return options
    }

    const [projectDropSelected, setProjectDropSelected] = useState([])
    const onChangeProjectsDrop = (event, data) => {
        setProjectDropSelected(data.value);
    };

    //todo dropSelected permettre le filtre?

    return (
        <div className="card">
            <h1> {t("admin_projects")}</h1>
            <Menu >
                <MultiSelect
                    optionsList={projects}
                    textKeyList={["id", "title", "type" ]}
                    setSelected={setProjectDropSelected}
                    loader={loader}
                />

            </Menu>
            {/*<Grid.Column> {t("title")} </Grid.Column>
            <Grid.Column> {t("creator")} </Grid.Column>
            <Grid.Column> {t("organization")} </Grid.Column>
            <Grid.Column> {t("date")}</Grid.Column>
            <Grid.Column> {t("description")} </Grid.Column>
            <Grid.Column> {t("picture")} </Grid.Column>*/}

            {!loader && projectDropSelected.length > 0 &&
            projectDropSelected.map(p => (
                <Segment basic key={p.id}>
                    <Menu className="unmarged" >
                        <Menu.Item>
                            <Item.Header>{ p.title }</Item.Header>
                        </Menu.Item>
                        <Menu.Menu position="right">
                            <Dropdown item compact text='Action' loading={loader2} >
                                <Dropdown.Menu>
                                    <>
                                        <Dropdown.Item onClick={() => handleAction("editProject", p)}>
                                            {t('edit') + " " + t('project')}
                                        </Dropdown.Item>
                                        {/*<Dropdown.Item onClick={() => handleAction("editEmail", o)}>
                                            {t('edit') + " " + t('email')}
                                        </Dropdown.Item>*/}
                                        {/*<Dropdown.Item>
                                                        {t('delete') + " " + t("picture")}
                                                    </Dropdown.Item>*/}
                                        {/*<Dropdown.Item>
                                                        {t("delete")}
                                                    </Dropdown.Item>*/}
                                    </>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Menu>
                    </Menu>
                    <Segment.Group horizontal className="unmarged" >
                        <Segment  >
                            <Picture size="tiny" picture={p.picture} />
                        </Segment>
                        <Segment  className="w-50 break-Word">
                            <Item>
                                <Item.Content>
                                    <p>{getTranslate(p, "description")}</p>
                                </Item.Content>
                            </Item>
                        </Segment>
                        <Segment  >
                            <p>
                                creator
                                date
                                orga
                                liste activity?
                            </p>

                        </Segment>

                    </Segment.Group>
                </Segment>
            ))
            }

            {!loader && filteredList.length === 0 &&
            <Container textAlign="center">
                <Message info>
                    <Message.Header> { t('search') }</Message.Header>
                    <p>{ t('no_result') }</p>
                </Message>
            </Container>
            }

            {!loader && error &&
            <Message negative>
                <Message.Header> { t('errors') }</Message.Header>
                <p>{ error }</p>
            </Message>
            }

            {loader &&
            <Segment>
                <Loader
                    active
                    content={
                        <p>{ t('loading') +" : " +  t('organization') + "s" }</p>
                    }
                    inline="centered"
                />
            </Segment>
            }

            <Modal show={show} handleClose={hideModal} title={ t(actionSelected) } >
                <div className="card">
                    {selectedProject &&
                    <>
                        <div className="messageBox">
                            {actionSelected === "editProject" &&
                            <ProjectForm
                                project={selectedProject}
                                setProject={setSelectedProject}
                                hideModal={hideModal}
                                handleEditProject={handleEditProject}
                            />
                            }
                        </div>
                    </>
                    }

                    {!selectedProject &&
                    <div> { t('errors')} </div>
                    }

                </div>
            </Modal>

        </div>
    )
}

export default withTranslation()(AdminProjects)