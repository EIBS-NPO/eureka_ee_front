
import { useState} from "react";
import {Dropdown, Item, Menu, Segment} from "semantic-ui-react";
import Picture from "./Picture";
import {MultilingualTextDisplay} from "./TextAreaMultilingual";
import {useTranslation, withTranslation} from "react-i18next";
import {FileDownloadForm } from "./FilesComponents";
import {ActivityPanelsContent} from "./entityViews/ActivityViews";
import {DropdownProfilEntity} from "./menus/MenuProfile";
import {menuItemListForActivity} from "../../__services/_Entity/activityServices";


const ManageActivity = ({activity, handleAction, loader = false}) => {

    const { t } = useTranslation()

    return (
        <Segment basic key={activity.id}>
            <Menu className="unmarged" >
                <Menu.Item>
                    <Item.Header>{ activity.title }</Item.Header>
                </Menu.Item>
                <Menu.Item>
                    <Item.Header color={activity.isPublic ? "green" : "red"}>
                        {activity.isPublic ? t('public') : t('private')}
                    </Item.Header>
                </Menu.Item>
                <Menu.Menu position="right">
                    <Dropdown item compact text='Action' loading={loader} >
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleAction("editActivity", activity)}>
                                {t('edit') + " " + t('activity')}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleAction("editFile", activity)}>
                                {t('edit') + " " + t('file')}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleAction("editFollowers", activity)}>
                                {t('edit') + " " + t('followers')}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleAction("editOrgActivity", activity)}>
                                {t('edit') + " " + t('organization')}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleAction("editProjectActivity", activity)}>
                                {t('edit') + " " + t('project')}
                            </Dropdown.Item>
                            {/*
                                <Dropdown.Item>
                                    {t("delete")}
                                </Dropdown.Item>
                            */}
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Menu>
            </Menu>

            <Segment className="unmarged"  padded='very'>
                    <Picture size="tiny" picture={activity.picture} isFloat="left" />

                    <MultilingualTextDisplay object={activity} typeText="summary"/>
            </Segment>

            {activity.creator &&
            <Segment className="unmarged unpadded" size="small">
                <p>{t('creator') + " " + activity.creator.firstname + " " + activity.creator.lastname}</p>
            </Segment>
            }

            <Segment className="unmarged">
                <FileDownloadForm activity={activity} access="admin" />
            </Segment>

        </Segment>
    )
}

export const DisplayActivity = ({t, ctx, isOwner, activity, setActivity, loader, history }) => {

    const [activeItem, setActiveItem] = useState("presentation")

    return (
        <Segment basic key={activity.id}>
            <Menu className="unmarged" >
                <Menu.Item
                    header
                    color={activity.isPublic ? "green" : "red"}
                    content={activity.isPublic ? t('public') : t('private')}
                />

                <Menu.Menu className="w-200px" position="right">
                    <Dropdown
                        item compact
                        text={ t(activeItem) }
                        loading={loader}
                        scrolling
                        upward={false}
                        fluid
                    >
                        <Dropdown.Menu className="minH-50" >
                            <DropdownProfilEntity
                                t={t}
                                ctx={ctx}
                                setActiveItem={ (value)=>setActiveItem(value) }
                                menuItemsList={ menuItemListForActivity( activity, isOwner) }
                            />
                        </Dropdown.Menu>

                    </Dropdown>
                </Menu.Menu>
            </Menu>

            <ActivityPanelsContent
                t={t}
                ctx={ctx}
                activeItem={activeItem}
                activity={activity}
                setActivity={setActivity}
                isOwner={isOwner}
                history={history}
            />

        </Segment>
    )
}

export default withTranslation()(ManageActivity)