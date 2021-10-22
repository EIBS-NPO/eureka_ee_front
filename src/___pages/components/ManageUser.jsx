import {Dropdown, Header, Item, Label, Menu, Segment} from "semantic-ui-react";
import Picture from "./Picture";
import userAPI from "../../__services/_API/userAPI";
import React, {useState} from "react";
import {useTranslation, withTranslation} from "react-i18next";

const ManageUser = ({user, handleAction}, loader=false) => {

    const { t } = useTranslation()

    return (
        <Segment basic key={user.id}>
            <Segment.Group horizontal className="unmarged" >
                <Segment>
                    { user.roles === "" && <Header color='pink'> {t('disabled')} </Header>}
                    { user.roles === "ROLE_USER" && <Header color='green'> {t('user')} </Header>}
                    { user.roles === "ROLE_ADMIN" && <Header color='violet'> {t('administrator')} </Header>}
                </Segment>
                <Segment>
                    {user.isConfirmed ? t('confirmed') : t('unconfirmed')}
                </Segment>

            </Segment.Group>
            <Menu className="unmarged" >
                <Menu.Item>
                    <Item.Header >{ user.firstname + " " + user.lastname }</Item.Header>
                </Menu.Item>
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
                            <Dropdown.Item onClick={() => handleAction("editEmail", user)}>
                                {t('edit') + " " + t('email')}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleAction("editAddress", user)}>
                                {t('edit') + " " + t('address')}
                            </Dropdown.Item>
                            {/*<Dropdown.Item>
                                            {t('delete') + " " + t("picture")}
                                                </Dropdown.Item>*/}
                            { user.roles !== "ROLE_ADMIN" &&
                            <Dropdown.Item onClick={() => handleAction("handleEnabling", user)}>
                                { user.roles === "" ?
                                    <Label color="blue">{t('enable')} </Label>
                                    :
                                    <Label color="pink">{t('disable') } </Label>
                                }
                            </Dropdown.Item>
                            }

                            {/*<Dropdown.Item>
                                            {t("delete")}
                                                </Dropdown.Item>*/}
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Menu>
            </Menu>
            <Segment.Group horizontal className="unmarged" >
                <Segment>
                    <Picture size="tiny" picture={user.picture} />
                </Segment>
                <Segment>
                    <Item>

                        <Item.Content verticalAlign='middle'>
                            <Item.Description>
                                <Label
                                    as="a"
                                    disabled={user.email === userAPI.checkMail()}
                                    basic color={user.email === userAPI.checkMail()? 'grey': 'teal'}
                                    href={"mailto:" + user.email} icon='mail' content={user.email}

                                />
                                <p>{ user.mobile ? user.mobile : t('not_specified') }</p>
                                <p>{ user.phone ? user.phone : t('not_specified') }</p>
                            </Item.Description>
                        </Item.Content>
                    </Item>
                </Segment>
                <Segment>
                    <Item>
                        <Item.Content>
                            { user.address &&
                            <Item.Description>
                                <p>{ user.address.address ? user.address.address : t('address') + " " + t('not_specified') }</p>
                                <p>{ user.address.complement ? user.address.complement : t('complement') + " " + t('not_specified') }</p>
                                <p>
                                    <span> { user.address.zipCode } </span>
                                    <span> { user.address.city } </span>
                                    <span> { user.address.country } </span>
                                </p>
                            </Item.Description>
                            }
                            {!user.address &&
                            <Item.Description> { t('address') + " " + t('not_specified') }</Item.Description>
                            }

                        </Item.Content>
                    </Item>
                </Segment>
            </Segment.Group>
        </Segment>
    )
}

export default withTranslation()(ManageUser)