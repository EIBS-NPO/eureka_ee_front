
import React, {useEffect, useState} from 'react'
import {useTranslation, withTranslation} from "react-i18next";
import activityAPI from "../../__services/_API/activityAPI";
import {Dropdown, Message} from "semantic-ui-react";
import projectAPI from "../../__services/_API/projectAPI";

const ProjectAddActivity = ({ userActivities, activities, handleSubmit }) => {
//console.log(project)
    const { t } = useTranslation()
    console.log(activities)
    const [loader, setLoader] = useState(false)

    const usedActivities = useState(activities)

    /*const [userActivities, setUserActivities] = useState([])*/
    const [freeActivities, setFreeActivities] =useState([])

    useEffect(() => {
        console.log(usedActivities)
        console.log(userActivities)
        let table = []
        userActivities.forEach(activity => {
            if(activities.find(a => a.id === activity.id) === undefined){
                table.push(activity)
            }
        })
        console.log(table)
        setFreeActivities(table)
    },[])


   /* const getDropList = () => {
        getAvActivity(userActivities)
        return (
            freeActivities.map( a =>
                <Dropdown.Item key={a.id} onClick={() => handleAdd(a.id)}>
                    { a.title }
                </Dropdown.Item>
            )
        )
    }*/

    /*const handleAdd = (activityId) => {
        setLoader(true)
        let act = freeActivities.find(a => activityId === a.id)
        projectAPI.manageActivity(act, project.id)
            .then(response => {
                console.log(response.data)
                if(response.data[0] === "success"){
                    activities.unshift(freeActivities.find(a => a.id === activityId))
                    console.log(activities)
                    setAct(activities)
                    setFreeActivities(freeActivities.filter(a => a.id !== activityId))
                }
            })
            .catch(error => console.log(error))
            .finally(()=> setLoader(false))
    }*/
/*
    useEffect(() => {
        setLoader(true)
        activityAPI.get("creator")
            .then(response => {
                console.log(response.data)
                setUserActivities(response.data)
                //getAvActivity(response.data)
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => setLoader(false))
    },[])*/

    return (
        !loader &&
        <>
            <Dropdown item text={ t('other')} >
                <Dropdown.Menu>
                    <Dropdown.Item>
                        <Message size='mini' info>
                            Veuillez selectionner un utilisateur
                        </Message>
                    </Dropdown.Item>
                    {freeActivities.map(a =>
                        <Dropdown.Item key={a.id} onClick={() => handleSubmit(a.id)}>
                            {a.title}
                        </Dropdown.Item>
                    )}

                </Dropdown.Menu>
            </Dropdown>
        </>
    )
}

export default withTranslation()(ProjectAddActivity)