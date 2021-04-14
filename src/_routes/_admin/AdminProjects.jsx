
import { withTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import projectAPI from "../../_services/projectAPI";

const AdminProjects = ( ) => {

    const [loader, setLoader] = useState( false)
    const [projects, setProjects] = useState([])
    const [error, setError] =useState("")

    useEffect( ( ) => {
        setLoader(true)
        projectAPI.get()
            .then(response => {
        //        console.log(response.data)
                setProjects(response.data)
            })
            .catch(error => {
                setError(error.response.data[0])
            })
            .finally( () => setLoader(false))
    }, [])

    return (
        <p> admin projects </p>
    )
}

export default withTranslation()(AdminProjects)