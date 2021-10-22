import authAPI from "../../../../../__services/_API/authAPI";
import userAPI from "../../../../../__services/_API/userAPI";
import React, {useState} from "react";
import {useTranslation, withTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import {UserSearchMenu} from "./SearchMenus";

//todo check unused var
const SearchBar = ({setData, setDropedData, searchFor, forAdmin}) => {
    const history = useHistory();
    const { t } = useTranslation()
    const [loader, setLoader] = useState(false)
    const [error, setError] = useState(undefined)
    const handleSearch = async (access,  admin= false, searchParams= undefined) => {
        setLoader(true)
        setData([])
        setDropedData([])
        setError("")
        let isAuth = authAPI.isAuthenticated()
        if (isAuth) {
            switch(searchFor){
                case "user":
                    userAPI.get(access, searchParams, admin?authAPI.isAdmin():undefined)
                        .then(response => {
                            console.log(response.data)
                            setData(response.data)
                        })
                        .catch(error => {
                            setError(error.response.data[0])
                        })
                        .finally(() => {
                            setLoader(false)
                        })
                    break
                case "activity":
                    break;
                case "project":
                    break;
                case "org":
                    break;
            }
        } else {
            history.replace('/login')
        }

    }

    return (
        searchFor === "user" && <UserSearchMenu handleSearch={handleSearch} forAdmin={forAdmin} />
    )
}

export default withTranslation()(SearchBar)