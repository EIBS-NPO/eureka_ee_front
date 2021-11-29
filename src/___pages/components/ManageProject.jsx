
import React, {useEffect, useState} from "react";
import {Dropdown, Item, Menu, Segment} from "semantic-ui-react";
import Picture from "./Picture";
import { useTranslation, withTranslation } from "react-i18next";
import { MultilingualTextDisplay } from "./TextAreaMultilingual";

import { ProjectPanelsContent} from "./entityViews/ProjectViews";
import {DropdownProfilEntity} from "./menus/MenuProfile";
import {menuItemListForProject} from "../../__services/_Entity/projectServices";


const ManageProject = ({project, handleAction, loader = false}) => {

    const { t } = useTranslation()

    return (
        <Segment basic key={project.id}>
            <Menu className="unmarged" >
                <Menu.Item>
                    <Item.Header>{ project.title }</Item.Header>
                </Menu.Item>
                <Menu.Menu position="right">
                    <Dropdown item compact text='Action' loading={loader} >
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleAction("editProject", project)}>
                                {t('edit') + " " + t('project')}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleAction("editTeams", project)}>
                                {t('edit') + " " + t('team')}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleAction("editFollowers", project)}>
                                {t('edit') + " " + t('bookmark')}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleAction("editOrgProject", project)}>
                                {t('edit') + " " + t('organizatoin')}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleAction("editActivitiesProject", project)}>
                                {t('edit') + " " + t('activities')}
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
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Menu>
            </Menu>

            <Segment.Group horizontal className="unmarged" >
                <Segment className="unmarged"  padded='very'>
                    <Picture size="tiny" picture={project.picture} isFloat="left" />

                    <MultilingualTextDisplay object={project} typeText="description"/>
                </Segment>
                {/*<Segment className="w-25" >
                    <Picture size="tiny" picture={project.picture} />
                </Segment>
                <Segment  className="w-75 break-Word">
                    <MultilingualTextDisplay object={project} typeText="description"/>
                    { project.startDate && <DateDisplay stringDate={project.startDate} dateName={t('startDate')}/> }
                    { project.endDate && <DateDisplay stringDate={project.endDate} dateName={t('endDate')}/> }
                </Segment>*/}

            </Segment.Group>

            {project.creator &&
                <Segment className="unmarged unpadded" size="small">
                    <p>{t('creator') + " " + project.creator.firstname + " " + project.creator.lastname}</p>
                </Segment>
            }

        </Segment>
    )

}

export const DisplayProject = ({ t, ctx, isOwner, project, setProject, loader, history }) => {
    const [activeItem, setActiveItem] = useState("presentation")

    return (
        <Segment basic key={project.id}>
            <Menu className="unmarged">
                <Menu.Menu position="right">
                    <Dropdown
                        item compact
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
                                menuItemsList={ menuItemListForProject( project, isOwner) }
                            />
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Menu>

            </Menu>

            <ProjectPanelsContent
                t={t}
                ctx={ctx}
                activeItem={activeItem}
                project={project}
                setProject={setProject}
                isOwner={isOwner}
                history={history}
            />

        </Segment>
    )
}


export default withTranslation()(ManageProject)