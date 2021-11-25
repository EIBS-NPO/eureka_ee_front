
import React, {useState} from "react";
import {Dropdown, Segment} from "semantic-ui-react";
import {useTranslation} from "react-i18next";
import { getSearchOptionFor } from "./searchMenuConfig"
import { SearchUserForm } from "../../../entityForms/UserForms";
import { SearchOrgForm } from "../../../entityForms/OrgForms";
import { SearchProjectForm } from "../../../entityForms/ProjectForms";
import {SearchActivityForm} from "../../../entityForms/ActivityForms";

//todo check unused var
export const SearchMenu = ({handleSearch, searchFor, forAdmin = false}) => {
    const { t } = useTranslation()

    const [object, setObject] = useState({})

    //todo pass setter to froms to ?
    const [formErrors, setFormsErrors] = useState({
        email: "",
        lastname: "",
        firstname: "",
    })

    //todo searchFor plural?
    const [searchValue, setSearchValue] = useState('select_option_for_'+searchFor+'s')
    const searchOptions = getSearchOptionFor(searchFor, t)

    const searchChange = (e, {value}) => {
        setSearchValue(value)
        if(value !== 'select_option_for_load_'+searchFor+'s' && value !== "search"){
            handleSubmit(e,value, forAdmin, object)
        }
    }

    //todo
    const [active, setActive] = useState("")

    const handleSubmit = (event, access, forAdmin, submitedObject = undefined) => {
        setActive(event.currentTarget.name)
        console.log(submitedObject)
        handleSearch(access, forAdmin, submitedObject)
    }

    const searchForm = () => {
        switch(searchFor){
            case "user":
                return <SearchUserForm user={object} setUser={setObject} handleSubmit={handleSubmit} formErrors={formErrors} forAdmin={true} />
            case "org":
                return <SearchOrgForm org={object} setOrg={setObject} handleSubmit={handleSubmit} formErrors={formErrors} forAdmin={true} />
            case "project":
                return <SearchProjectForm project={object} setProject={setObject} handleSubmit={handleSubmit} formErrors={formErrors} forAdmin={true} />
            case "activity":
                return <SearchActivityForm activity={object} setActivity={setObject} handleSubmit={handleSubmit} formErrors={formErrors} forAdmin={true}/>

        }
    }

    return (
        <Segment >
            <Dropdown
                text={t(searchValue)}
                closeOnBlur
                value={searchValue}
                options={searchOptions}
                onChange={searchChange}
                fluid
            />

            {searchValue === "search" &&
                searchForm()
            }
        </Segment>
    )
}