
import React, { useState } from "react"
import {withTranslation} from "react-i18next";
import { Form, Button, Icon, Item } from "semantic-ui-react";
import activityAPI from "../../../__services/_API/activityAPI";
import projectAPI from "../../../__services/_API/projectAPI";
import {HandleUpdateActivity} from "../../../__services/_Entity/activityServices";
import {HandleUpdateProject} from "../../../__services/_Entity/projectServices";

/**
 *
 * @param obj
 * @param setter
 * @param type
 * @param isFollow
 * @returns {JSX.Element}
 * @constructor
 */
const FollowingForm = ( { obj, setter, type, history } ) => {

    const [loader, setLoader] = useState(false)
    const [error, setError] = useState("")

    const handleForm = async () => {
        setLoader(true)
        if (type === "activity") {
            await HandleUpdateActivity({id: obj.id, follow: true},
                setter,
                setLoader,
                setError,
                history
            )
            /*activityAPI.put(obj, {follow: true})
                .then((response) => {
                    setter(response.data[0])
                })
                .catch((error) => {
                    console.log(error.response)
                })
                .finally(() => {
                    setLoader(false)
                })*/
        } else {
            await HandleUpdateProject({id: obj.id, follow: true},
                setter,
                setLoader,
                setError,
                history
            )
           /* projectAPI.put(obj, {"follow": true})
                .then(response => {
                    setter(response.data[0])
                })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => {
                    setLoader(false)
                })*/
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