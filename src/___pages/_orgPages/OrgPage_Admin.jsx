
import {useTranslation, withTranslation} from "react-i18next";
import React, {useContext, useEffect, useState} from "react";
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
import {ContentContainer} from "../components/Loader";

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

    const handleAction = async (type, org) => {
        setSelectedOrg(org)
        if (type === "editPartner") {
            await HandleUpdateOrg({id: org.id, partner: true}, postTreatment, setLoader, setError, history, true)
        }
        else {
            setSelectedOrg(org)
            setActionSelected(type)
            setShow(true)
        }

    }

    const cancelForm = () => {
        hideModal()
    }

    const hideModal = () => {
        setShow(false)
        setActionSelected(undefined)
        setSelectedOrg(undefined)
        setLoader2(false)
    }

    const postTreatment = async (orgResult) => {
        let orgId
        if(selectedOrg) { orgId = selectedOrg.id} else { orgId = orgResult.id}
        await RefreshOptionAndDroppedSelection(orgs, orgDropSelected, orgId, orgResult)

        //todo partnerFooter Refresh
        //partner refresh //todo
        /*      let partner = partnerList.find(p => p.id === orgResult.id);
              if(partner !== undefined && orgResult.partner === undefined){
                  //remove partner
                  partnerList.splice(partnerList.indexOf(partner), 1);
                  setPartnerList(partnerList)
              }else if( partner === undefined && orgResult.partner !== undefined){
                  //add partner
                  partnerList.push(orgResult)
                  setPartnerList(partnerList)
              }*/

        if (actionSelected !== "editProjectsOrg" && actionSelected !== "editActivitiesOrg") {
            hideModal()
        } else {
            setSelectedOrg(orgResult)
        }
    }

    const [searchLoader, setSearchLoader] = useState(false)
    const [orgDropSelected, setOrgDropSelected] = useState([])

        console.log(orgDropSelected)

    return (
        <ContentContainer
            loaderActive={false}
            loaderMsg={ t('loading') +" : " + t('organizations') }
        >
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
                    <ManageOrg key={o.id} org={o}  handleAction={handleAction} loader={loader}/>
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

            {/*{loader &&
            <Segment>
                <Loader
                    active
                    content={
                        <p>{ t('loading') +" : " +  t('organization') + "s" }</p>
                    }
                    inline="centered"
                />
            </Segment>
            }*/}

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
                                t={t}
                                history={history}
                                object={selectedOrg}
                                addressFor="org"
                                postTreatment={postTreatment}
                                cancel={cancelForm}
                                isRequired={true}
                                forAdmin={true}
                            />
                            }
                            {actionSelected === "editMembership" &&
                            <UpdateAssignedForm
                                t={t}
                                isOwner={false}
                                object={selectedOrg}
                                objectType="org"
                                onClose={cancelForm}
                                history={history}
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

        </ContentContainer>
    )
}

export default withTranslation()(OrgPage_Admin)