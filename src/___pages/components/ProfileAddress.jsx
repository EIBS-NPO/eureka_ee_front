
import React, { useState  } from 'react';
import {Item, Label} from "semantic-ui-react";
import userAPI from "../../__services/_API/userAPI";
import utilities from "../../__services/utilities";
import {AddressDisplay, AddressForm} from "./Address";
import {withTranslation} from "react-i18next";

//todo displace in Address?
export const ProfileAddress = ({ t, history, type, obj, setObject, withForm=false }) => {

    const [isForm,setIsForm] = useState(false)

    const isOwner = () => {
        let userMail = userAPI.checkMail()

        if(type === "user"){
            return obj && obj.email === userMail
        }
        else{
            return obj.referent.email === userMail
        }
    }

    const postTreatment = (objectResponse) => {
        setObject(objectResponse)
        setIsForm(false)
    }

    return (
        <Item.Group>
            <Item>
                <Item.Content>
                    <Label attached='top'>
                        <h4>{utilities.strUcFirst(t("address"))}</h4>
                    </Label>
                    {isForm &&
                        <AddressForm
                            t={t}
                            history={history}
                            object={ obj }
                            addressFor={"user"}
                            postTreatment={postTreatment}
                            cancel={ ()=>setIsForm(false) }
                        />
                    }
                    {!isForm &&
                        <Item.Description>
                            <Item.Group divided >
                                <AddressDisplay
                                    object={ obj }
                                    setSwitch={ ()=>setIsForm(true) }
                                    editable={ withForm && isOwner() === true }
                                />
                            </Item.Group>
                        </Item.Description>
                    }
                </Item.Content>
            </Item>
        </Item.Group>
    )
}

export default withTranslation()(ProfileAddress)