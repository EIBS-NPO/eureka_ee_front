
import {useTranslation, withTranslation} from "react-i18next";
import React, { useState } from "react";
import {
    Segment,
    Menu,
    Message,
    Container,
    Loader
} from "semantic-ui-react";
import Modal from "../components/Modal";
import MultiSelect, {RefreshOptionAndDroppedSelection} from "../components/menus/components/MultiSelect";
import SearchBar from "../components/menus/components/search/SearchBar";
import ManageProject from "../components/ManageProject";
import {UpdatedProjectForm} from "../components/entityForms/ProjectForms";
import {UpdateAssignedForm, UpdateFollowersForm} from "../components/FollowersComponents";
import {ActivitiesPanelForProject, OrgsPanelForProject} from "../components/entityViews/ProjectViews";
import {BtnOnCLick} from "../components/Buttons";

const ProjectPage_Admin = ( history ) => {

    const { t } = useTranslation()

    const [loader, setLoader] = useState( false)
   // const [searchLoader, setSearchLoader] = useState( false)
    const [selectedProject, setSelectedProject] = useState(undefined)

    const [projects, setProjects] = useState([])
    const [error, setError] =useState("")

 //   const [loader2, setLoader2] = useState(false)
    const [actionSelected, setActionSelected] = useState(undefined)
    const [show, setShow] = useState(false)
    const handleAction = ( type, p ) => {
        setSelectedProject(p)
        setActionSelected(type)
        setShow(true)
        //    setLoader2(true)
    }

    const cancelForm = () => {
   //     e.preventDefault()
        hideModal()
    }

    const hideModal = () => {
        setShow(false)
        setActionSelected(undefined)
        setSelectedProject(undefined)
    //    setLoader2(false)
    }

    const postTreatment = ( projectResult ) => {
        RefreshOptionAndDroppedSelection(projects, projectDropSelected, selectedProject.id, projectResult)

        if(actionSelected !== "editOrgProject" && actionSelected !== "editActivitiesProject"){
            hideModal()
        }else {
            setSelectedProject( projectResult )
        }

    }

    const [projectDropSelected, setProjectDropSelected] = useState([])

    return (
        <div className="card">
            <h1> {t("admin_projects")}</h1>
            <Menu vertical fluid>
                <SearchBar
                    setData={setProjects}
                    setDropedData={setProjectDropSelected}
                    searchFor={"project"}
                    setLoader={setLoader}
                    forAdmin={true}
                />
                <Menu.Item>
                    <MultiSelect
                        optionsList={projects}
                        textKeyList={["id", "title"]}
                        setSelected={setProjectDropSelected}
                        loader={loader}
                    />
                </Menu.Item>
            </Menu>

            {!loader && projectDropSelected.length > 0 &&
            projectDropSelected.map(p => (
                <ManageProject key={p.id} project={p} handleAction={handleAction} loader={loader}/>
            ))
            }

            {!loader && projectDropSelected.length === 0 && projects.length === 0 &&
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
                        <p>{ t('loading') +" : " +  t('organizations') }</p>
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
                                <UpdatedProjectForm
                                    project={selectedProject}
                                    postTreatment={postTreatment}
                                    forAdmin={true}
                                    cancelForm={cancelForm}
                                />
                            }

                            {actionSelected === "editFollowers" &&
                                <UpdateFollowersForm
                                    object={selectedProject}
                                    objectType="project"
                                    onClose={cancelForm}
                                    history={history}
                                />
                            }

                            {actionSelected === "editTeams" &&
                                <UpdateAssignedForm
                                    t={t}
                                    isOwner={false}
                                    object={selectedProject}
                                    objectType="project"
                                    onClose={cancelForm}
                                    history={history}
                                    forAdmin={true}
                                />
                            }

                            {actionSelected === "editOrgProject" &&
                            <OrgsPanelForProject
                                t={t}
                                project={ selectedProject }
                                postTreatment={postTreatment}
                                history={history}
                                needConfirm={true}
                                forAdmin={true}
                            />
                            }

                            {actionSelected === "editActivitiesProject" &&
                            <ActivitiesPanelForProject
                                t={t}
                                project={ selectedProject }
                                postTreatment={postTreatment}
                                history={history}
                                needConfirm={true}
                                forAdmin={true}
                            />
                            }

                            <Segment basic>
                                <BtnOnCLick onClickFunction={() => cancelForm()} text={t('finish')}/>
                            </Segment>
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

export default withTranslation()(ProjectPage_Admin)