import React from 'react';
import {Menu} from "semantic-ui-react";
import {withTranslation} from "react-i18next";

const AdminMenu = (props) => {
    return(
        <Menu vertical>
            <Menu.Item>
                <Menu.Header>{ props.t('admin') }</Menu.Header>
            </Menu.Item>
        </Menu>
    );
}

export default withTranslation()(AdminMenu);