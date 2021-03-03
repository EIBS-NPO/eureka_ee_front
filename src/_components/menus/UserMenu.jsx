
import React, { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import {withTranslation} from "react-i18next";
import authAPI from "../../_services/authAPI";

const UserMenu = ( props ) => {

    const [activeItem, setActiveItem] = useState()
    const handleItemClick = (e, { name }) => setActiveItem({ activeItem: name })

    const [lastname, setLastname] = useState("")
    const [firstname, setFirstname] = useState("")

    useEffect(()=>{
       setLastname(authAPI.getLastname())
       setFirstname(authAPI.getFirstname())
    },[])

        return (
            <Menu vertical>
                <Menu.Item>
                    <p> { lastname + " " + firstname }</p>
                    <Menu.Header>{ props.t('my_space') }</Menu.Header>

                    <Menu.Menu>
                        <Menu.Item
                            as={NavLink} to='/all_activities/creator'
                            name={ props.t('my_activities') }
                            active={activeItem === props.t('my_activities')}
                            onClick={handleItemClick}
                        />
                        <Menu.Item
                            as={NavLink} to='/all_activities/follower'
                            name={ props.t('my_favorites') }
                            active={activeItem === props.t('my_favorites')}
                            onClick={handleItemClick}
                        />
                        <Menu.Item
                            as={NavLink} to='/all_organizations/my'
                            name={ props.t('my_org') }
                            active={activeItem ===  props.t('my_org')  }
                            onClick={handleItemClick}
                        />
                        <Menu.Item
                            as={NavLink} to='/all_projects/creator'
                            name={ props.t('my_projects') }
                            active={activeItem ===  props.t('my_projects')  }
                            onClick={handleItemClick}
                        />
                    </Menu.Menu>
                </Menu.Item>
            </Menu>
    )
}

export default withTranslation()(UserMenu);