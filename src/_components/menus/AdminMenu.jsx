import React from 'react';
import { NavLink } from "react-router-dom";
import {Menu} from "semantic-ui-react";
import {withTranslation} from "react-i18next";

const AdminMenu = (props) => {
    return(
        <Menu vertical>
            <Menu.Item>
                <Menu.Header>{ props.t('admin') }</Menu.Header>

                {/*<Menu.Menu>
                    <Menu.Item
                        as={NavLink} to='/all_projects/public'
                        name={ props.t('all_projects') }
                        active={activeItem === props.t('all_projects')}
                        onClick={handleItemClick}
                    />
                    <Menu.Item
                        as={NavLink} to='/all_activities/public'
                        name={ props.t('all_activities') }
                        active={activeItem ===  props.t('all_activities')  }
                        onClick={handleItemClick}
                    />
                    <Menu.Item
                        as={NavLink} to='/all_organizations/public'
                        name={ props.t('all_org') }
                        active={activeItem ===  props.t('all_org')  }
                        onClick={handleItemClick}
                    />
                </Menu.Menu>*/}
            </Menu.Item>
        </Menu>
    );
}

export default withTranslation()(AdminMenu);