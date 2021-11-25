
import React, {useContext, useState} from "react";
import { withTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { SearchMenu } from "./SearchMenus";
import AuthContext from "../../../../../__appContexts/AuthContext";
import {HandleGetUsers} from "../../../../../__services/_Entity/userServices";
import {HandleGetActivities} from "../../../../../__services/_Entity/activityServices";
import {HandleGetProjects} from "../../../../../__services/_Entity/projectServices";
import {HandleGetOrgs} from "../../../../../__services/_Entity/organizationServices";

//todo check unused var
const SearchBar = ({setData, setDropedData, searchFor, setLoader, forAdmin}) => {
    const history = useHistory();
    //todo error
    const [error, setError] = useState(undefined)

    const isAdmin = useContext(AuthContext).isAdmin

    const handleSearch = async (access,  admin= false, searchParams= undefined) => {
        setData([])
        setDropedData([])
        setError("")
            switch(searchFor){
                case "user":
                    await HandleGetUsers(
                        {access:access, user:searchParams},
                        setData, setLoader, setError,
                        history, forAdmin && isAdmin === true
                    )
                    break
                case "activity":
                    await HandleGetActivities(
                        {access: access, activity: searchParams},
                        setData, setLoader, setError,
                        history, forAdmin && isAdmin === true
                    )
                    break;
                case "project":
                    await HandleGetProjects(
                        {access: access, project: searchParams},
                        setData, setLoader, setError,
                        history, forAdmin && isAdmin === true
                    )
                    break;
                case "org":
                    await HandleGetOrgs(
                        {access: access, org: searchParams},
                        setData, setLoader, setError,
                        history, forAdmin && isAdmin === true
                    )
                    break;
            }

    }

    return (
        <SearchMenu handleSearch={handleSearch} searchFor={searchFor} forAdmin={forAdmin}/>
    )
}

export default withTranslation()(SearchBar)