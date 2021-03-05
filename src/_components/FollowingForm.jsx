
import React, { useState, useEffect } from "react"
import {withTranslation} from "react-i18next";
import { Form, Button, Icon, Item } from "semantic-ui-react";
import activityAPI from "../_services/activityAPI";
import authAPI from "../_services/authAPI";
import projectAPI from "../_services/projectAPI";

/**
 *
 * @param obj obj|project
 * @param setter
 * @param type
 * @returns {JSX.Element}
 * @constructor
 */
const FollowingForm = ( { obj, setter, type } ) => {

    const [isFollow, setIsFollow] = useState(false)
    const [loader, setLoader] = useState(false)

    useEffect( () => {
        console.log(obj)
        if(authAPI.isAuthenticated()){
            if(type === "project"){
                projectAPI.isFollowing( obj.id )
                    .then(response => {
                        console.log(response.data[0])
                        setIsFollow(response.data[0])
                    })
                    .catch(error => console.log(error.response.data))
            }

            if(type === "activity"){
                activityAPI.isFollowing( obj.id )
                    .then(response => {
                        console.log(response.data[0])
                        setIsFollow(response.data[0])
                    })
                    .catch(error => console.log(error.response.data))
                }
            }
    }, [type, obj])

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
       // icon: star outline
    //    <Label as='a' content='Elliot' image={imageProps} />
        <Form onSubmit={handleForm} loading={loader}>
            <Item>
                <Button basic compact animated >
                    <Button.Content visible>
                        {isFollow ? <Icon name='star' color="yellow"/> : <Icon name='star outline' />}
                        BookMark
                    </Button.Content>
                    <Button.Content hidden>
                        {isFollow ? <Icon name='star outline' /> :  <Icon name='star' color="yellow"/>}
                        BookMark
                    </Button.Content>
                </Button>
            </Item>
        </Form>

    )
}

export default withTranslation()(FollowingForm)