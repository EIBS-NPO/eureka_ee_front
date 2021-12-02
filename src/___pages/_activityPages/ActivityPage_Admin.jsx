import {Container, Header, Loader, Menu, Message, Segment} from "semantic-ui-react";
import SearchBar from "../components/menus/components/search/SearchBar";
import MultiSelect, {RefreshOptionAndDroppedSelection} from "../components/menus/components/MultiSelect";
import React, {useState} from "react";
import {useTranslation, withTranslation} from "react-i18next";
import Modal from "../components/Modal";
import {UpdatedActivityForm} from "../components/entityForms/ActivityForms";
import ManageActivity from "../components/entityViews/ManageActivity";
import {FileUploadForm} from "../components/Inputs/FilesComponents";
import {UpdateFollowersForm} from "../components/Inputs/FollowersComponents";
import {BtnOnCLick} from "../components/Inputs/Buttons";
import {OrgPanelForActivity, ProjectPanelForActivity} from "../components/entityViews/ActivityViews";


const ActivityPage_Admin = (history ) => {

    const { t } = useTranslation()

    const [activities, setActivities] = useState([])
    const [activitiesDropSelected, setActivitiesDropSelected] = useState([])
    const [activitySelected, setActivitySelected] = useState(undefined)

    const [searchLoader, setSearchLoader] = useState(false)
    const [updateLoader, setUpdateLoader] = useState(false)


    const [error, setError] =useState("")

    //modal
    const [actionSelected, setActionSelected] = useState(undefined)

    const [show, setShow] = useState(false)
    const handleAction = ( type, a ) => {
        setActivitySelected(a)
        setActionSelected(type)
        setShow(true)
        //    setLoader2(true)
    }

    const hideModal = () => {
        setShow(false)
        setActionSelected(undefined)
        setActivitySelected(undefined)
      //  setUpdateLoader(false)
    }

    //form
    const cancelForm = () => {
  //      e.preventDefault()
   //     setError("")
        hideModal()
    }

    const postTreatment = (activityResult) => {
        RefreshOptionAndDroppedSelection(activities, activitiesDropSelected, activitySelected.id, activityResult)

        if(actionSelected !== "editOrgActivity" && actionSelected !== "editProjectActivity"){
            hideModal()
        }else{
            setActivitySelected( activityResult )
        }

    }

    return(
        <div className="card">
            <h1> {t("admin_activities")}</h1>
            <Menu vertical fluid>
                <SearchBar
                    setData={setActivities}
                    setDropedData={setActivitiesDropSelected}
                    searchFor={"activity"}
                    setLoader={setSearchLoader}
                    forAdmin={true}
                />
                <Menu.Item>
                    <MultiSelect
                        optionsList={activities}
                        textKeyList={["id", "title"]}
                        setSelected={setActivitiesDropSelected}
                        placeholder={t('ask_select_activities')}
                        loader={searchLoader}
                    />
                </Menu.Item>
            </Menu>

            {!searchLoader && activitiesDropSelected.length > 0 &&
            activitiesDropSelected.map(a => (
                <ManageActivity key={a.id} activity={a} handleAction={handleAction} loader={updateLoader}/>
            ))
            }

            {!searchLoader && activitiesDropSelected.length === 0 && activities.length === 0 &&
            <Container textAlign="center">
                <Message info>
                    <Message.Header> { t('search') }</Message.Header>
                    <p>{ t('no_result') }</p>
                </Message>
            </Container>
            }

            {!searchLoader && error &&
            <Message negative>
                <Message.Header> { t('errors') }</Message.Header>
                <p>{ error }</p>
            </Message>
            }

            {searchLoader &&
            <Segment>
                <Loader
                    active
                    content={
                        <p>{ t('loading') +" : " +  t('activities') }</p>
                    }
                    inline="centered"
                />
            </Segment>
            }

            {activitySelected &&
            <Modal show={show} handleClose={hideModal} title={ activitySelected.title } >
                <div className="card">
                    <Header>{ t(actionSelected) }</Header>
                   {/* {activitySelected &&*/}
                        <>
                            <div className="messageBox">
                                {actionSelected === "editActivity" &&
                                    <UpdatedActivityForm
                                        activity={activitySelected}
                                        postTreatment={postTreatment}
                                        forAdmin={true}
                                        cancelForm={cancelForm}
                                    />
                                }
                                {actionSelected === "editFile" &&
                                    <FileUploadForm
                                        t={t}
                                        activity={activitySelected}
                                        postTreatment={postTreatment}
                                        forAdmin={true}
                                        error={error}
                                        onClose={cancelForm}
                                    />
                                }
                                {actionSelected === "editFollowers" &&
                                    <UpdateFollowersForm
                                        object={activitySelected}
                                        objectType="activity"
                                        onClose={cancelForm}
                                    />
                                }
                                {actionSelected === "editOrgActivity" &&
                                    <OrgPanelForActivity
                                        t={t}
                                        activity={ activitySelected }
                                        postTreatment={ postTreatment}
                                        history={history}
                                        needConfirm={true}
                                        forAdmin={true}
                                    />
                                }
                                {actionSelected === "editProjectActivity" &&
                                <ProjectPanelForActivity
                                    t={t}
                                    activity={ activitySelected }
                                    postTreatment={ postTreatment }
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
                  {/*  }*/}

                    {!activitySelected &&
                    <div> { t('errors')} </div>
                    }

                </div>
            </Modal>
            }

        </div>
    )

}

export default withTranslation()(
    ActivityPage_Admin
)