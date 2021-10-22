
import React, { useState } from "react"
import {withTranslation} from "react-i18next";
import { Form, Button, Icon, Item } from "semantic-ui-react";
import activityAPI from "../../../__services/_API/activityAPI";
import projectAPI from "../../../__services/_API/projectAPI";

/**
 *
 * @param obj
 * @param setter
 * @param type
 * @param isFollow
 * @returns {JSX.Element}
 * @constructor
 */
const FollowingForm = ( { obj, setter, type} ) => {

    const [loader, setLoader] = useState(false)

    const handleForm = () => {
        setLoader(true)
            if(type === "activity"){
                activityAPI.put(obj, {follow:true})
                    .then((response) => {
                        setter(response.data[0])
                    })
                    .catch((error) => {
                        console.log(error.response)
                    })
                    .finally(() => {
                        setLoader(false)
                    })
            }
            else {
                projectAPI.put(obj, {"follow":true})
                    .then( response => {
                        setter(response.data[0])
                    })
                    .catch(error => {
                        console.log(error)
                    })
                    .finally(() => {
                        setLoader(false)
                    })
            }
    }

    return (
        <Form onSubmit={handleForm} loading={loader}>
            <Item>
                <Button basic>
                    {obj && obj.isFollowed ? <Icon name='star' color="yellow"/> : <Icon name='star outline' />}
                    BookMark
                </Button >
            </Item>
        </Form>
    )
}

export default withTranslation()(FollowingForm)