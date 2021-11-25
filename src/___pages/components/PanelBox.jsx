import {Dropdown, Header, Menu, Segment} from "semantic-ui-react";
import React, {useState} from "react";


export const PanelBox = ({ Media, ItemNameList, panelBoxFor  }) => {

    return (
        <Segment vertical >
            <PanelMenu Media={Media} ItemNameList={ItemNameList} panelBoxFor={panelBoxFor}/>
        </Segment>
    )
}

export const PanelMenu = ({ Media, ItemNameList, panelBoxFor }) => {
    const [activeItem, setActiveItem] = useState('presentation')
    const handleItemClick = (e, { name }) => setActiveItem(name)

    return (
        <>
            <Media greaterThan="xs">
                <PanelMenuGreaterXs ItemNameList={ItemNameList} activeItem={activeItem} handleItemClick={handleItemClick} />
                <PanelsContent panelFor={panelBoxFor}/>
            </Media>
            <Media at="xs">
                <PanelMenuXs ItemNameList={ItemNameList} activeItem={activeItem} handleItemClick={handleItemClick} />
                <PanelsContent panelFor={panelBoxFor}/>
            </Media>
        </>

    )
}

export const PanelMenuGreaterXs = ({ ItemNameList, activeItem, handleItemClick }) => {
    return (
        <Menu attached='top' tabular>
            {ItemNameList.map( itemName => (
                <Menu.Item
                    name={ itemName }
                    active={activeItem === itemName }
                    onClick={(e)=>handleItemClick(e)}
                >
                    <Header >
                        { props.t(itemName) }
                    </Header>
                </Menu.Item>
            ))}
            {/*<Menu.Item
                name='presentation'
                active={activeItem === 'presentation'}
                onClick={handleItemClick}
            >
                <Header >
                    { props.t("presentation") }
                </Header>
            </Menu.Item>*/}
        </Menu>
    )
}
export const PanelMenuXs = ({ ItemNameList, activeItem, handleItemClick }) => {

    return (
        <Menu attached='top' tabular>
            <Dropdown text={activeItem}>
                <Dropdown.Menu >
                    {ItemNameList.map( itemName => (
                        <Dropdown.Item
                            name={ itemName } active={activeItem === itemName}
                           onClick={handleItemClick}
                        >
                            { props.t(itemName) }
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </Menu>
    )
}

export const PanelsContent = ( { panelFor } ) => {

    //recup dans ActivityViews
    return (
        <>
            {/* Presentation Tab */}
            {activeItem === "presentation" &&
            <Segment attached='bottom' >
                <PresentationPanel />
            </Segment>
            }

            {activeItem === "upload" && (ctx==="owned" || ctx==="asssigned") &&
            <Segment attached='bottom'>
                <UploadPanel />
            </Segment>
            }

            {activeItem === "project" && (
                <ProjectPanel />
            )}

            {activeItem === "organization" &&
            <OrgPanel />
            }
        </>
    )
}