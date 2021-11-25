import {Dropdown, Header, Image, Segment} from "semantic-ui-react";

export const DropdownItem = ({ t, setActiveItem, item , isOwner= false, isAdmin= false }) => {

    /*
    { avatar: true, src: '/images/avatar/small/elliot.jpg' },
     */
    return (
        <>
            {item.header && item.header && <Dropdown.Header content={item.header}/>}
            <Dropdown.Item
                key= { item.itemName }
                onClick={ () => setActiveItem( item.itemName ) }
                text= { item.text ?  <Header> {item.text} </Header>
                    :
                     t('no_' + item.itemName)
                     (isOwner || isAdmin) &&   <Header> t("add_" + item.itemName) </Header>
                }
                image= {item.picture ? {avatar: true, src: `data:image/jpeg;base64,${item.picture}` }
                    : undefined
                }
            />
           {/* <Dropdown.Item onClick={ () => setActiveItem( item.itemName ) } >
                { item.text &&
                <span>
                    {item.picture &&
                    <Image src ={`data:image/jpeg;base64,${item.picture}`}   avatar size="mini"/>
                    }
                    <Header> {item.text} </Header>
                </span>
                }

                { !item.text &&
                <>
                    { t('no_' + item.itemName) }
                    {(isOwner || isAdmin) &&
                    <Header>  {"add_" + item.itemName} </Header>
                    }
                </>
                }

            </Dropdown.Item>*/}
            <Dropdown.Divider />
        </>


    )
}

export const DropdownProfilEntity = ({ t, setActiveItem, ctx, menuItemsList, isAdmin=false }) => {

    return (
        menuItemsList.map((menuItem, key) => (
           /* <>
                {menuItem.header && menuItem.header && <Dropdown.Header content={menuItem.header}/>}*/
                <DropdownItem
                    key={key}
                    t={t}
                    setActiveItem={setActiveItem}
                    isOwner={ (ctx==="owned" || ctx==="asssigned") }
                    isAdmin={isAdmin}
                    item={menuItem}
                />
        //        <Dropdown.Divider />
       //     </>

        ))
    )
}

export const PanelContent = (props) => {
    return (
        <Segment className="unpadded minH-50" attached='bottom' >
            { props.children }
        </Segment>
    )
}