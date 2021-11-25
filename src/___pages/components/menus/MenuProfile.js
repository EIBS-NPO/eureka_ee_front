import {Dropdown, Header, Segment} from "semantic-ui-react";

function getGenderTrad(itemName){
    let traductionKey="share_in"
    switch(itemName){
        case "organization":
        case "activity":
            traductionKey = "f_gender_shared_in"
            break;
        case "project":
            traductionKey = "m_gender_shared_in"
            break;
        case "organizations":
        case "activities":
            traductionKey = "f_plural_shared_in"
            break;
        case "projects":
            traductionKey = "m_plural_shared_in"
            break;
    }
    return traductionKey
}

export const DropdownItem = ({ t, setActiveItem, item , isOwner= false, isAdmin= false }) => {

    return (
        <>
            { item.header && item.header &&
                <Dropdown.Header
                    content={ t( getGenderTrad(item.itemName) ) +" "+ t(item.header) }
                />
            }
            <Dropdown.Item
                key= { item.itemName }
                onClick={ () => setActiveItem( item.itemName ) }
                text= { item.text ?  <Header> {item.text} </Header>
                    :
                    <Header>
                        {t('no_' + item.itemName)}
                        {(isOwner || isAdmin) &&  <Header.Subheader> {t("add")} </Header.Subheader>}
                    </Header>

                }
                image= {item.picture ? {avatar: true, src: `data:image/jpeg;base64,${item.picture}` }
                    : undefined
                }
            />
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