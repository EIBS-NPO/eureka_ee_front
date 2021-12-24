import {Dropdown, Header, Label, Menu, Segment} from "semantic-ui-react";
import React from "react";
import {useTranslation, withTranslation} from "react-i18next";
import {UserCard} from "./UserViews";

const ManageUser = ({user, handleAction, loader= false}) => {

    const { t } = useTranslation()

    return (
        <Segment basic >
            <Segment className="unmarged" >
                <Header>{ user.firstname + " " + user.lastname }</Header>
            </Segment>
            <Menu className="unmarged" >
                <Menu.Item>
                    { user.roles === "" && <Header color='pink'> {t('disabled')} </Header>}
                    { user.roles === "ROLE_USER" && <Header color='green'> {t('user')} </Header>}
                    { user.roles === "ROLE_ADMIN" && <Header color='violet'> {t('administrator')} </Header>}
                </Menu.Item>
                <Menu.Menu position="right" >
                    <Dropdown item icon='wrench' text={t('action')} loading={loader} >
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleAction("editUser", user)}>
                                {t('edit') + " " + t('user')}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleAction("editAddress", user)}>
                                {t('edit') + " " + t('address')}
                            </Dropdown.Item>
                            {!user.isConfirmed &&
                                <Dropdown.Item onClick={() => handleAction("confirmUser", user)}>
                                    <Label color="blue">{t('confirm') + " " + t('email')}</Label>
                                </Dropdown.Item>
                            }

                            { user.roles !== "ROLE_ADMIN" &&
                            <Dropdown.Item onClick={() => handleAction("handleEnabling", user)}>
                                { user.roles === "" ?
                                    <Label color="blue">{t('enable')} </Label>
                                    :
                                    <Label color="pink">{t('disable') } </Label>
                                }
                            </Dropdown.Item>
                            }

                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Menu>
            </Menu>

            <Segment className="center stretch wrapped unmarged" >
                <UserCard t={t} user={user} forAdmin={true}/>
            </Segment>

        </Segment>
    )
}

export default withTranslation()(ManageUser)