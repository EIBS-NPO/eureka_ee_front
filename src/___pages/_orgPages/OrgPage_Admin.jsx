
import {useTranslation, withTranslation} from "react-i18next";
import React, {useContext, useState} from "react";
import {Menu, Segment, Message, Container, Loader } from "semantic-ui-react";
import Modal from "../components/Modal";
import {AddressForm} from "../components/Address";
import authAPI from "../../__services/_API/authAPI";

import MultiSelect, {RefreshOptionAndDroppedSelection} from "../components/menus/components/MultiSelect";
import SearchBar from "../components/menus/components/search/SearchBar";
import ManageOrg from "../components/ManageOrg";
import {UpdatedOrgForm} from "../components/entityForms/OrgForms";
import AuthContext from "../../__appContexts/AuthContext";
import {UpdateAssignedForm} from "../components/FollowersComponents";
import {ActivitiesPanelForOrg, ProjectsPanelForOrg} from "../components/entityViews/OrganizationViews";
import {BtnOnCLick} from "../components/Buttons";
import {HandleUpdateOrg} from "../../__services/_Entity/organizationServices";

const OrgPage_Admin = (history ) => {
    const { t } = useTranslation()
    const { partnerList, setPartnerList } = useContext(AuthContext)

    const [orgs, setOrgs] = useState([])
    const [selectedOrg, setSelectedOrg] = useState(undefined)
    const [error, setError] = useState( "")
    const [loader, setLoader] = useState(false)

    const [loader2, setLoader2] = useState(false)
    const [actionSelected, setActionSelected] = useState(undefined)
    const [show, setShow] = useState(false)

    const handleAction = ( type, org ) => {
        if(type === "editPartner"){
            handleUpdate({id:org.id, partner: !(org.partner && org.partner) })
        }else {
            setSelectedOrg(org)
            setActionSelected(type)
            setShow(true)
        }

    }
/*
    const [modalSettings, setModalSettings] = useState({
        show:false,
        title:"",
        message:"",
        action:{},
        target:{},
        cancel:{}
    })*/

    const cancelForm = () => {
        hideModal()
    }

    const hideModal = () => {
        setShow(false)
        setActionSelected(undefined)
        setSelectedOrg(undefined)
        setLoader2(false)
    }

    const postTreatment = ( orgResult ) => {
        RefreshOptionAndDroppedSelection(orgs, orgDropSelected, selectedOrg.id, orgResult)

        //todo partnerFooter Refresh
        //partner refresh //todo
        let partner = partnerList.find(p => p.id === orgResult.id);
        if(partner !== undefined && orgResult.partner === undefined){
            //remove partner
            partnerList.splice(partnerList.indexOf(partner), 1);
            setPartnerList(partnerList)
        }else if( partner === undefined && orgResult.partner !== undefined){
            //add partner
            partnerList.push(orgResult)
            setPartnerList(partnerList)
        }

        if(actionSelected !== "editProjectsOrg" && actionSelected !== "editActivitiesOrg"){
            hideModal()
        }else {
            setSelectedOrg(orgResult)
        }
    }


    //todo
    //just used for address, make address Service
    const handleUpdate = async (updatedOrg) => {
        setLoader(true)
        if (await authAPI.isAuthenticated()) {
            let adminManagment = {admin:true}

            //handle enable/disable partner
            if(updatedOrg.partner !== undefined){adminManagment["partner"] = updatedOrg.partner}

            await HandleUpdateOrg( updatedOrg, postTreatment, setLoader, setError, history, true)

        } else {
            history.replace('/login')
        }
    }

  /*  const handlePartner = (org) => {
        setLoader(true)
        if(org.partner !== undefined ){
            org.partner = false
        }else {
            org.partner = true
        }
        orgAPI.put(org)
            .then((response) => {
               // let upOrg = orgs.find(o => o.id === org.id)

                let index = orgs.indexOf(response.data[0])

                orgs.splice(index, 1, response.data[0]);
            })
            .catch(error => console.log(error))
            .finally( () => setLoader(false))
    }
*/
    const [searchLoader, setSearchLoader] = useState(false)
    const [orgDropSelected, setOrgDropSelected] = useState([])
    return (
        <div className="card">
            <h1> {t("admin_orgs")}</h1>
            <Menu vertical fluid>
                <SearchBar
                    setData={setOrgs}
                    setDropedData={setOrgDropSelected}
                    searchFor={"org"}
                    setLoader={setSearchLoader}
                    forAdmin={true}
                />
                <Menu.Item disabled={orgs.length <= 0}>
                    <MultiSelect
                        optionsList={orgs}
                        textKeyList={["id", "name", "type" ]}
                        setSelected={setOrgDropSelected}
                        placeholder={t('ask_select_org')}
                        loader={searchLoader}
                    />
                </Menu.Item>
            </Menu>

            {!searchLoader && orgDropSelected.length > 0 &&
                orgDropSelected.map(o => (
                    <ManageOrg org={o}  handleAction={handleAction} loader={loader2}/>
                ))
            }

            {!searchLoader && orgDropSelected.length === 0 && orgs.length === 0 &&
                <Container textAlign="center">
                    <Message info>
                        <Message.Header> { t('search') }</Message.Header>
                        <p>{ t('no_result') }</p>
                    </Message>
                </Container>
            }

            {!searchLoader && orgDropSelected.length === 0 && orgs.length > 0 &&
                <Container textAlign="center">
                    <Message info>
                        <p>{ t('ask_select_org') }</p>
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
                <div className="card minH-50">
                    {selectedOrg &&
                    <>
                        <div className="messageBox">
                            {actionSelected === "editOrganization" &&
                            <UpdatedOrgForm
                                org={selectedOrg}
                                postTreatment={postTreatment}
                                forAdmin={true}
                                cancelForm={cancelForm}
                            />
                            }
                            {actionSelected === "editAddress" &&
                            <AddressForm
                                handleSubmit={handleUpdate}
                                obj={selectedOrg}
                                isRequired={true}
                                errors={error} loader={loader2}
                                cancel={cancelForm}
                            />
                            }
                            {actionSelected === "editMembership" &&
                            <UpdateAssignedForm
                                object={selectedOrg}
                                objectType="org"
                                onClose={cancelForm}
                                forAdmin={true}
                            />
                            }

                            {actionSelected === "editProjectsOrg" &&
                            <ProjectsPanelForOrg
                                t={t}
                                org={ selectedOrg }
                                postTreatment={ postTreatment }
                                history={history}
                                needConfirm={true}
                                forAdmin={true}
                            />
                            }

                            {actionSelected === "editActivitiesOrg" &&
                            <ActivitiesPanelForOrg
                                t={t}
                                org={ selectedOrg }
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
                    }

                    {!selectedOrg &&
                    <div> { t('errors')} </div>
                    }

                </div>
            </Modal>

        </div>
    )
}

export default withTranslation()(OrgPage_Admin)