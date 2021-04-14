
import React, {useContext, useState} from 'react';
import AuthContext from "../../_contexts/AuthContext";
import '../../scss/components/leftMenu.scss';
import {Menu} from "semantic-ui-react";
import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";
import utilities from "../../_services/utilities";

const LeftMenu = ( ) => {
    const { isAuthenticated, isAdmin } = useContext(AuthContext)

    const { t } = useTranslation()

    const [activeItem, setActiveItem] = useState()
    const handleItemClick = (e, { name }) => setActiveItem({ activeItem: name })

    return (

                <Menu id="left_menu" vertical>
                    {isAuthenticated && isAdmin && (
                        <Menu.Item>
                            <Menu.Header>{ t('admin') }</Menu.Header>
                            <Menu.Item
                                as={NavLink} to='/admin/users'
                                name={ t('users') }
                                active={activeItem === t('admin_users')}
                                onClick={handleItemClick}
                            />
                            <Menu.Item
                                as={NavLink} to='/admin/orgs'
                                name={ t('organization') +"s" }
                                active={activeItem === t('admin_orgs')}
                                onClick={handleItemClick}
                            />
                            <Menu.Item
                                as={NavLink} to='/admin/projects'
                                name={ t('projects') }
                                active={activeItem === t('admin_projects')}
                                onClick={handleItemClick}
                            />
                            <Menu.Item
                                as={NavLink} to='/admin/activities'
                                name={ t('activities') }
                                active={activeItem === t('admin_activities')}
                                onClick={handleItemClick}
                            />
                        </Menu.Item>
                        /*<AdminMenu />*/
                    )}
                    <Menu.Item>
                        <Menu.Header>{ utilities.strUcFirst( t('activity') ) }</Menu.Header>
                        <Menu.Menu>
                            {isAuthenticated && (
                                <Menu.Item
                                    as={NavLink} to='/all_activities/creator'
                                    name={ t('my_activities') }
                                    active={activeItem === t('my_activities')}
                                    onClick={handleItemClick}
                                />
                            )}
                            <Menu.Item
                                as={NavLink} to='/all_activities/public'
                                name={ t('public_activities') }
                                active={activeItem ===  t('public_activities')  }
                                onClick={handleItemClick}
                            />
                            {isAuthenticated && (
                                <Menu.Item
                                    as={NavLink} to='/all_activities/follower'
                                    name={ t('my_favorites') }
                                    active={activeItem === t('my_favorites')}
                                    onClick={handleItemClick}
                                />
                            )}
                        </Menu.Menu>
                    </Menu.Item>

                    <Menu.Item>
                        <Menu.Header>{ utilities.strUcFirst( t('project') ) }</Menu.Header>
                        <Menu.Menu>
                            {isAuthenticated && (
                                <Menu.Item
                                    as={NavLink} to='/all_projects/creator'
                                    name={ t('my_projects') }
                                    active={activeItem ===  t('my_projects')  }
                                    onClick={handleItemClick}
                                />
                            )}
                            <Menu.Item
                                as={NavLink} to='/all_projects/public'
                                name={ t('all_projects') }
                                active={activeItem === t('all_projects')}
                                onClick={handleItemClick}
                            />
                            {isAuthenticated && (
                                <Menu.Item
                                    as={NavLink} to='/all_projects/follower'
                                    name={ t('my_favorites') }
                                    active={activeItem === t('my_favorites')}
                                    onClick={handleItemClick}
                                />
                            )}
                        </Menu.Menu>
                    </Menu.Item>

                    <Menu.Item>
                        <Menu.Header>{ utilities.strUcFirst( t('organization') ) }</Menu.Header>
                        <Menu.Menu>
                            {isAuthenticated && (
                                <Menu.Item
                                    as={NavLink} to='/all_organizations/my'
                                    name={ t('my_org') }
                                    active={activeItem ===  t('my_org')  }
                                    onClick={handleItemClick}
                                />
                            )}
                            <Menu.Item
                                as={NavLink} to='/all_organizations/public'
                                name={ t('all_org') }
                                active={activeItem ===  t('all_org')  }
                                onClick={handleItemClick}
                            />
                        </Menu.Menu>
                    </Menu.Item>

                </Menu>
    )
}

export default LeftMenu;