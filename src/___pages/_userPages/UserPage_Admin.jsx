
import React, {useState, useContext} from 'react'
import {Menu, Message, Container, Loader, Segment, Button} from "semantic-ui-react";
import {useTranslation, withTranslation} from "react-i18next";
import Modal from "../components/Modal";

import AuthContext from "../../__appContexts/AuthContext";
import MultiSelect, {RefreshOptionAndDroppedSelection} from "../components/menus/components/MultiSelect";

import SearchBar from "../components/menus/components/search/SearchBar";
import ManageUser from "../components/entityViews/ManageUser";
import {DisplayConfirmAccountProcess, UpdateUserForm} from "../components/entityForms/UserForms";
import {AddressForm} from "../components/entityViews/AddressView";
import mailerAPI from "../../__services/_API/mailerAPI";
import authAPI from "../../__services/_API/authAPI";
import {HandleGetUsers, HandleUserUpdate} from "../../__services/_Entity/userServices";

const UserPage_Admin = ({history}) => {
    const { t } = useTranslation()

    const { firstname, setFirstname, lastname, setLastname, setNeedConfirm} = useContext(AuthContext);

    const [users, setUsers] = useState([])
    const [error, setError] = useState("")
    const [searchLoader, setSearchLoader] = useState(false)

    const [loader2, setLoader2] = useState(false)
    const [postTreatmentLoader, setPostTreatmentLoader] = useState(false)
    const [actionSelected, setActionSelected] = useState("")
    const [show, setShow] = useState(false)


    const handleAction = ( type, user ) => {
            /*if(type === "handleEnabling"){
                user = {id:user.id, roles:user.roles}
            }*/
            setSelectedUser(user)
            setActionSelected(type)
            setShow(true)
     //   }
    }

    const [selectedUser, setSelectedUser] = useState(undefined)


    //todo if just hideModal pass directly hideModal
    const cancelForm = () => {
        hideModal()
    }

    const hideModal = () => {
        setShow(false)
        setActionSelected("")
        setSelectedUser(undefined)
        setLoader2(false)
    }

    //todo check loader
    //todo check loader when logout (ou voir a le faire faire par le backend? dans certain cas?)
    //todo check if run  maybe conflic with return array or not by bdd
    //tod voir ci-dessous
    const postTreatment = async (userResponse) => {

        //if admin change user's email
        if (selectedUser.email !== userResponse.email) {
            //send confirm mail to the userUpdated

            //permettre le chargement si l'un des deux est true
            //ainsi que le form pass par modale ou pas on peut gérer le loader meme avec traitment supplémentaire ici.
            await mailerAPI.sendConfirmMail(t, selectedUser)
                .then(() => {
                    //for the case when admin change his own email, logout.
                    if(authAPI.getId() === userResponse.id){
                        setNeedConfirm(true)
                        history.replace("/login")
                    }
                })
                .catch(err => console.log(err)) //todo remove console.log
        }
        //if admin change his own firstname or lastname
        if(authAPI.getId() === userResponse.id){
            if(userResponse.firstname !== firstname)setFirstname(userResponse.firstname)
            if(userResponse.lastname !== lastname)setLastname(userResponse.lastname)
        }
        RefreshOptionAndDroppedSelection(users, userDropSelected, selectedUser.id, userResponse)
        hideModal()
    }

    const postTreatmentConfirmUser = async () => {
        function prePostTreatment(response) {
            postTreatment(response[0])
        }
        await HandleGetUsers({access: "search", user: {id: selectedUser.id}},
            prePostTreatment, setPostTreatmentLoader, setError, history, true
        )
    }

    const HandleEnabling = (user) => {
        HandleUserUpdate(
            {id:user.id, roles:user.roles},
            postTreatment, setPostTreatmentLoader, setError, history, true
        )
    }

    const [userDropSelected, setUserDropSelected] = useState([])
    return (
        <div className="card">
            <h1> {t("admin_users")}</h1>
            <Menu vertical fluid>
                    <SearchBar
                        setData={setUsers}
                        setDropedData={setUserDropSelected}
                        searchFor="user"
                        setLoader={setSearchLoader}
                        forAdmin={true}
                    />
                <Menu.Item disabled={users.length <= 0}>
                    <MultiSelect
                        optionsList={users}
                        textKeyList={["id", "email", "firstname", "lastname" ]}
                        setSelected={setUserDropSelected}
                        placeholder={t('ask_select_user')}
                        loader={searchLoader}
                    />
                </Menu.Item>
            </Menu>


            {!searchLoader && userDropSelected.length > 0 &&
                userDropSelected.map( u => (
                    <ManageUser key={u.id} user={u} handleAction={handleAction} loader={loader2}/>
                ))
            }

            {!searchLoader && userDropSelected.length === 0 && users.length === 0 &&
                <Container textAlign="center">
                    <Message info>
                        <Message.Header> { t('search') }</Message.Header>
                        { t('no_result') }
                    </Message>
                </Container>
            }

            {!searchLoader && userDropSelected.length === 0 && users.length > 0 &&
            <Container textAlign="center">
                <Message info>
                    { t('ask_select_user') }
                </Message>
            </Container>
            }

            {!searchLoader && error &&
                <Message negative>
                    <Message.Header> { t('errors') }</Message.Header>
                    { error }
                </Message>
            }

            {searchLoader &&
                <Segment>
                    <Loader
                        active
                        content={
                            <p>{ t('loading') +" : " +  t('users') }</p>
                        }
                        inline="centered"
                    />
                </Segment>
            }

            <Modal show={show} handleClose={hideModal} title={ t(actionSelected) } >
                <div className={"card"}>
                    {selectedUser &&
                    <>
                        <div className="messageBox">
                            {actionSelected === "editUser" &&
                                <UpdateUserForm
                                    history={history}
                                    user={selectedUser}
                                    postTreatment={postTreatment}
                                    forAdmin={true}
                                    cancelForm={cancelForm}
                                />
                            }
                            {actionSelected === "editAddress" &&
                                <AddressForm
                                    t={t}
                                    history={history}
                                    object={ selectedUser }
                                    addressFor={"user"}
                                    postTreatment={postTreatment}
                                    cancel={cancelForm}
                                    forAdmin={true}
                                />
                            }

                            {actionSelected === "confirmUser" &&
                                <DisplayConfirmAccountProcess
                                    t={t}
                                    tokenActivation={selectedUser.gpAttributes["user.token.activation"].propertyValue[0]}
                                    postTreatment={postTreatmentConfirmUser}
                                    loader={postTreatmentLoader}
                                    setLoader={setPostTreatmentLoader}
                                    error={error}
                                    setError={setError}
                                    forAdmin={true}
                                    handleCancel={hideModal}
                                />
                            }

                            {actionSelected === 'handleEnabling' &&
                                <>
                                    <p> TODO trad Enabling confirm message TODO</p>
                                    <p> Un utilisateur désactivé, pour toujours se connecter, mais ne pourra plus créer/modifier de ressource. Sn propre compte y compris. </p>
                                    <p> Il ne pourra plus voir les ressources privées non plus. </p>

                                    <Button.Group>
                                        <Button size="small" onClick={hideModal}> { t("cancel") } </Button>
                                        <Button.Or />
                                        <Button size="small" positive onClick={()=>HandleEnabling(selectedUser)} > { t("confirm") } </Button>
                                    </Button.Group>
                                </>


                            }
                        </div>
                    </>
                    }

                    {/* //todo ? {!selectedUser &&
                    <p> { t('errors')} </p>
                    }*/}

                </div>
            </Modal>
        </div>
    )
}

export default withTranslation()(UserPage_Admin)