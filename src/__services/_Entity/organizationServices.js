import authAPI from "../_API/authAPI";
import OrgAPI from "../_API/orgAPI";
import {checkMultiTextHaveChange, checkMultiTextHaveText, checkStringLenght} from "../formPatternControl";
import orgAPI from "../_API/orgAPI";


export const HandleCreateOrg = async ( newOrg, postTreatment, setLoader, setErrors, history) => {

    setLoader(true)
    if(await (authAPI.isAuthenticated())) {
        OrgAPI.post(newOrg)
            .then(response => {
                let newOrg
                let urlMsg = ""
                if (response && response.status >= 200 && response.status < 300) {
                    switch (response.status) {
                        case 206 :
                            newOrg = response.data[1]
                            urlMsg = "_" + response.data[0].split(" : ")[2];
                            break;
                        default :
                            newOrg = response.data[0]
                    }
                }
                postTreatment(newOrg, urlMsg)
            })
            .catch(error => {
                console.log(error.response.data)
                setErrors(error.response.data);
            })
            .finally(()=>{
                setLoader(false)
            })
        }else {
            history.replace('/login')
        }
}

export const HandleUpdateOrg = async (updatedOrg, postTreatment, setLoader, setErrors, history, isAdmin = false) => {

    setLoader(true)
    if (authAPI.isAuthenticated()) {
        let adminManagment = isAdmin ? { admin : true } : undefined
        //handle enable/disable partner
        if(updatedOrg.partner !== undefined){adminManagment["partner"] = updatedOrg.partner}

        orgAPI.put(updatedOrg, adminManagment)
            .then(response => {
                postTreatment(response.data[0])
            })
            .catch(error => {
            //    console.log(error.response)
                setErrors(error.response);
            })
            .finally(() => setLoader(false))

    } else history.replace('/login')
}

export const HandleGetOrgs = async (params, postTreatment, setLoader = undefined, setErrors, history = undefined, isAdmin = false) => {

    if(setLoader)setLoader(true)
    if (params.access === 'public') {
        //or all or partner
        if(!params.org) params.access = "all"

        orgAPI.getPublic(params.access, params.org)
            .then(response => {
                //    postTreatment( response.data.length === 1 ? response.data[0] : response.data )
                postTreatment(response.data)
            })
            .catch(error => {
                console.log(error)
                setErrors(error.response.data)
            })
            .finally(() => {    if (setLoader) setLoader(false) })
    } else {
        if (await authAPI.isAuthenticated()) {
            orgAPI.get(params.access, params.org, isAdmin)
                .then(response => {
                    //    postTreatment( response.data.length === 1 ? response.data[0] : response.data )
                    postTreatment(response.data)
                })
                .catch(error => {
                    console.log(error.response)
                    setErrors(error.response)
                })
                .finally(() => {    if (setLoader) setLoader(false) })
        } else history.replace('/login')
    }
}

export const checkOrgFormValidity = ( org, setErrors ) => {
    let errorsRslt = []
    let boolRslt = true

    //name
    if (org.name && !checkStringLenght(org.name, 2, 50)){
        errorsRslt["name"] = "error_namePattern"
        boolRslt = false;
    }else  errorsRslt["name"] = undefined

    //type
    if (org.type && !checkStringLenght(org.type, 2, 50)){
        errorsRslt["type"] = "error_typePattern"
        boolRslt = false;
    }else  errorsRslt["type"] = undefined

    //description
    if(!checkMultiTextHaveText( org.description )){
        errorsRslt["description"] = "description is required"
        boolRslt = false
    }

    boolRslt ? setErrors( {} ) : setErrors( errorsRslt )

    return boolRslt
}

export function checkOrgChanges( actualOrg, initialOrg, returnOnlyChanges = false ){
    if(returnOnlyChanges) {

        let orgWithChanges = { ...actualOrg }
        //submit only really changes
        if (actualOrg.name === initialOrg.name) orgWithChanges.name = undefined
        if (actualOrg.type === initialOrg.type) orgWithChanges.type = undefined
        if (actualOrg.email === initialOrg.email) orgWithChanges.email = undefined
        if((actualOrg.phone || actualOrg.phone === null) && actualOrg.phone === initialOrg.phone) orgWithChanges.phone = undefined

        if(!checkMultiTextHaveChange(initialOrg.description, actualOrg.description)) orgWithChanges.description = undefined

        return orgWithChanges

    } else {

        let boolResult = false

        if(
            (actualOrg.name && actualOrg.name !== initialOrg.name)
            || (actualOrg.type && actualOrg.type !== initialOrg.type)
            || (actualOrg.email && actualOrg.email !== initialOrg.email)
            || (actualOrg.phone && actualOrg.phone !== initialOrg.phone)
            || checkMultiTextHaveChange(initialOrg.description, actualOrg.description)
            || actualOrg.pictureFile !== undefined
        ) boolResult = true

        return boolResult
    }
}

export function menuItemListForOrg ( org, isOwner=false, isAdmin=false ) {

        //presentation
        let itemTable = [{ itemName:"presentation", text:"presentation" }]

        //address
        itemTable.push( { itemName:"address", text:"address"})

        //membership
        itemTable.push( { itemName:"membership", text:"membership"})

        //projects
        itemTable.push( { itemName:"projects",
            header:"projects",
            text : org.activities && org.activities.length > 0 ? org.activities.length + " " : undefined
        })
    
        //organization
        itemTable.push({ itemName:"activities",
            header: "activities",
            text: org.projects && org.projects.length > 0 ? org.projects.length + " " : undefined
        })

    return itemTable
}
