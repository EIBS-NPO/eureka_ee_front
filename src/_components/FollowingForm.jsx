
import React, { useState } from "react"
import {withTranslation} from "react-i18next";
import { Form, Button, Icon, Item } from "semantic-ui-react";
import activityAPI from "../_services/activityAPI";
import projectAPI from "../_services/projectAPI";

/**
 *
 * @param obj obj|project
 * @param setter
 * @param type
 * @param isFollow
 * @param setIsFollow
 * @returns {JSX.Element}
 * @constructor
 */
const FollowingForm = ( { obj, setter, type, isFollow, setIsFollow } ) => {

    const [loader, setLoader] = useState(false)

    const handleForm = () => {
        setLoader(true)
        if(!isFollow){
            if(type === "activity"){
                activityAPI.addFollow(obj.id)
                    .then((response) => {
                        setIsFollow(true)
                        obj.followers.push(response.data[0].id)
                        setter(obj)
                        console.log(response)
                        console.log(obj)
                    })
                    .catch((error) => {
                        console.log(error.response)
                    })
                    .finally(() => {
                        setLoader(false)
                    })
            }
            else {
                projectAPI.addFollowing(obj.id)
                    .then( response => {
                        console.log(response)
                        setIsFollow(true)
                    })
                    .catch(error => {
                        console.log(error)
                    })
                    .finally(() => {
                        setLoader(false)
                    })
            }

        }else {
            if(type === "activity"){
                activityAPI.rmvFollow(obj.id)
                    .then((response) => {
                        setIsFollow(false)
                        // supprime 1 élément à partir de l'index 3
                        // enleves = mesPoissons.splice(3, 1);
                        //console.log(array1.findIndex(isLargeNumber));
                        obj.followers.splice(
                            obj.followers.findIndex(response.data[0].id), 1
                        )
                        setter(obj)
                        console.log(obj)
                        console.log(response)
                    })
                    .catch((error) => {
                        console.log(error.response)
                    })
                    .finally(() => {
                        setLoader(false)
                    })
            }
            else {
                projectAPI.rmvFollowing(obj.id)
                    .then( response => {
                        console.log(response)
                        setIsFollow(false)
                    })
                    .catch(error => {
                        console.log(error)
                    })
                    .finally(() => {
                        setLoader(false)
                    })
            }

        }
    }

    return (
        <Form onSubmit={handleForm} loading={loader}>
            <Item>
                <Button basic>
                    {isFollow ? <Icon name='star' color="yellow"/> : <Icon name='star outline' />}
                    BookMark
                </Button >
            </Item>
        </Form>
    )
}

export default withTranslation()(FollowingForm)