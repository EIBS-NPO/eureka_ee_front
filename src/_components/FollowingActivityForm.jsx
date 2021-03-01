
import React, { useState, useEffect } from "react"
import {withTranslation} from "react-i18next";
import { Form, Button, Icon, Item } from "semantic-ui-react";
import activityAPI from "../_services/activityAPI";
import authAPI from "../_services/authAPI";


const FollowingActivityForm = ( { activity, setter } ) => {

    const [isFollow, setIsFollow] = useState(false)
    const [loader, setLoader] = useState(false)
console.log(isFollow)
    console.log(activity)
    useEffect( () => {
        if(authAPI.isAuthenticated()){
            if(activity.followers){
                let follower = activity.followers.find(f => f === authAPI.getId())
                if(follower){
                    setIsFollow(true)
                }
            }
        }
    }, [])

    const handleForm = () => {
        setLoader(true)
        if(!isFollow){
            activityAPI.addFollow(activity.id)
                .then((response) => {
                    setIsFollow(true)
                    activity.followers.push(response.data[0].id)
                    setter(activity)
                    console.log(response)
                    console.log(activity)
                })
                .catch((error) => {
                    console.log(error.response)
                })
                .finally(() => {
                    setLoader(false)
                })
        }else {
            activityAPI.rmvFollow(activity.id)
                .then((response) => {
                    setIsFollow(false)
                    // supprime 1 élément à partir de l'index 3
                    // enleves = mesPoissons.splice(3, 1);
                    //console.log(array1.findIndex(isLargeNumber));
                    activity.followers.splice(
                        activity.followers.findIndex(response.data[0].id), 1
                    )
                    setter(activity)
                    console.log(activity)
                    console.log(response)
                })
                .catch((error) => {
                    console.log(error.response)
                })
                .finally(() => {
                    setLoader(false)
                })
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

export default withTranslation()(FollowingActivityForm)