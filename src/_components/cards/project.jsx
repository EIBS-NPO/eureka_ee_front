import React from 'react';
import { Item, Label } from 'semantic-ui-react'
import '../../scss/components/cardOrg.scss';
import { withTranslation } from 'react-i18next';
import {NavLink} from "react-router-dom";

const Project = ({ t, project, context }) => {


    return (
        <Item>
            {project.picture &&
            <Item.Image src={`data:image/jpeg;base64,${project.picture}`}/>
            }
            {!project.picture &&
            <Item.Image src='https://react.semantic-ui.com/images/wireframe/image.png' />
            }

            <Item.Content>
                <Item.Header>{project.name}</Item.Header>
                <Item.Meta>
                    <span>début : {project.startDate}</span>
                    {project.endDate && (
                        <span>fin : {project.endDate}</span>
                    )}

                </Item.Meta>
                <Item.Description>{project.description}</Item.Description>
                <Item.Extra>
                    <Label icon='globe' content='Additional Languages' />
                    {context === "creator" && (
                        <NavLink to={"/update_project/" + project.id }>Update</NavLink>
                    )}
                </Item.Extra>
            </Item.Content>
        </Item>
    );
};

export default withTranslation()(Project);

