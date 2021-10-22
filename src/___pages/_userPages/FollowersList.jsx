
import React, { useEffect, useState } from "react"
import {useTranslation, withTranslation} from "react-i18next";
import activityAPI from "../../__services/_API/activityAPI";
import Card from "/components/Card";
import { Divider } from "semantic-ui-react";

const FollowersList = ( { obj, listFor }) => {
    const { t } = useTranslation()

    const [followers, setFollowers] = useState([])


    const [errors, setErrors] = useState("")

    const [loader, setLoader] = useState(false)

    useEffect(()=> {
        setLoader(true)
   //     if(obj.followers){
            if(listFor === "activity"){
                activityAPI.getFollowers(obj.id)
                    .then(response => {

                        setFollowers(response.data)
                    })
                    .catch(error => {
                        console.log(error.response)
                        setErrors(error.response.data)
                    })
                    .finally(() => setLoader(false))
            }

           /* if(listFor === "project"){
                activityAPI.getFollowers(obj.id)
                    .then(response => {
                        setFollowers(response.data[0])
                    })
                    .catch(error => {
                        setErrors(error.response.data)
                    })
                    .finally(() => setLoader(false))
            }*/
   //     }
    }, [obj])

    return (
        !loader &&
        <>
            {
                followers && followers.length > 0
                && followers.map( (f, key) => (
                    <>
                        <Card key={f.id} obj={f} type="user" isLink={true}/>
                        <Divider />
                    </>
                    )
                )
            }
        </>
    )
}

export default withTranslation()(FollowersList)