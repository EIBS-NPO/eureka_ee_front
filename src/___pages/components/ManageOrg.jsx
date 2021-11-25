
import React, {useState} from "react";
import {Dropdown, Item, Label, Menu, Segment} from "semantic-ui-react";
import Picture from "./Picture";
import {useTranslation, withTranslation} from "react-i18next";
import { MultilingualTextDisplay } from "./TextAreaMultilingual";
import {AddressDisplay } from "./Address";
import {OrgPanelsContent,} from "./entityViews/OrganizationViews";
import {DropdownProfilEntity} from "./menus/MenuProfile";
import {menuItemListForOrg} from "../../__services/_Entity/organizationServices";


const ManageOrg = ({org, handleAction, loader = false}) => {

    const { t } = useTranslation()

    return (
        <Segment basic key={org.id}>
            <Menu className="unmarged" >
                <Menu.Item fluid>
                    <Item.Content>
                        <Item.Header>{ org.name }</Item.Header>
                        <Item.Description content={org.type}/>
                    </Item.Content>
                    {org.partner &&  <Label color="blue" >{t('partner')}</Label>}
                </Menu.Item>
                <Menu.Menu position="right">
                    <Dropdown item compact text='Action' loading={loader} >
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleAction("editOrganization", org)}>
                                {t('edit') + " " + t('organization')}
                            </Dropdown.Item>
                            {/*<Dropdown.Item onClick={() => handleAction("editEmail", o)}>
                                        {t('edit') + " " + t('email')}
                                    </Dropdown.Item>*/}
                            <Dropdown.Item onClick={() => handleAction("editAddress", org)}>
                                {t('edit') + " " + t('address')}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleAction("editMembership", org)}>
                                {t('edit') + " " + t('membership')}
                            </Dropdown.Item>

                            <Dropdown.Item onClick={() => handleAction("editProjectsOrg", org)}>
                                {t('edit') + " " + t('projects')}
                            </Dropdown.Item>


                            <Dropdown.Item onClick={() => handleAction("editActivitiesOrg", org)}>
                                {t('edit') + " " + t('activities')}
                            </Dropdown.Item>


                            <Dropdown.Item onClick={() => handleAction("editPartner", org)}>
                                {!org.partner &&  <Label color="blue" >{ t('tag') + " " + t('partner')}</Label>}
                                {org.partner &&  <Label color="pink" >{ t('untag') + " " + t('partner')}</Label>}
                            </Dropdown.Item>


                            {/*<Dropdown.Item>
                                                    {t('delete') + " " + t("picture")}
                                                </Dropdown.Item>*/}
                            {/*<Dropdown.Item>
                                                    {t("delete")}
                                                </Dropdown.Item>*/}
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Menu>
            </Menu>

            <Segment.Group horizontal className="unmarged" >

                <Segment className="unmarged w-70"  padded='very'>
                    <Picture size="tiny" picture={org.picture} isFloat="left" />

                    <MultilingualTextDisplay object={org} typeText="description"/>
                </Segment>

                <Segment  className="w-25">
                    <AddressDisplay object={org} />
                </Segment>

            </Segment.Group>
            <Segment className="unmarged unpadded" size="small">
                <p>{t('referent') + " " + org.referent.firstname + " " + org.referent.lastname}</p>
            </Segment>
        </Segment>
    )
}

export const DisplayOrg = ({t, ctx, isOwner, org, setOrg, loader, history} ) =>{

    const [activeItem, setActiveItem] = useState("presentation")

    return (
        <Segment basic key={org.id}>
            <Menu className="unmarged">
                <Menu.Menu position="right">
                    <Dropdown
                        item
                        compact
                        text={ t(activeItem) }
                        loading={loader}
                        scrolling
                        upward={false}
                    >

                        <Dropdown.Menu className="minH-50">
                            <DropdownProfilEntity
                                t={t}
                                ctx={ctx}
                                setActiveItem={ (value)=>setActiveItem(value) }
                                menuItemsList={ menuItemListForOrg( org, isOwner) }
                            />
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Menu>

            </Menu>

            <OrgPanelsContent
                t={t}
                ctx={ctx}
                activeItem={activeItem}
                org={org}
                setOrg={setOrg}
                isOwner={isOwner}
                history={history}
            />

        </Segment>
    )

}

export default withTranslation()(ManageOrg)