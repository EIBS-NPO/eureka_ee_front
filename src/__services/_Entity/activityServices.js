
import activityAPI from "../_API/activityAPI";
import authAPI from "../_API/authAPI";
import {checkMultiTextHaveChange, checkMultiTextHaveText, checkStringLenght} from "../formPatternControl";

export const HandleCreateActivity = async (newActivity, postTreatment, setLoader, setErrors, history) => {
        setLoader(true)
        if (authAPI.isAuthenticated()) {

            activityAPI.post(newActivity)
                .then( response => {
                    postTreatment(response.data[0])
                })
                .catch(error => {
                    console.log(error.response)
                    setErrors(error.response)
                })
                .finally(()=> {
                    setLoader(false)
                })
        }
        else history.replace('/login')
}

export const HandleUpdateActivity = async (updatedActivity, postTreatment, setLoader, setErrors, history, forAdmin = false) => {
    setLoader(true)

    if (authAPI.isAuthenticated()) {
        let adminManagment = {admin: forAdmin}

        activityAPI.put(updatedActivity, adminManagment)
            .then(response => {
                postTreatment(response.data[0])
            })
            .catch(error => {
                console.log(error.response.data)
                setErrors(error.response.data)
            })
            .finally(() => setLoader(false))
      }
    else history.replace('/login')
}

export const HandleGetActivities = async (params, postTreatment, setLoader, setErrors, isAdmin = false, history = undefined) => {

    setLoader(true)
    if (params.access === 'public') {
        if(!params.activity) params.access = "all"

        activityAPI.getPublic(params.access, params.activity)
            .then(response => {
                postTreatment(response.data)
            })
            .catch(error => {
                console.log(error)
                setErrors(error.response.data)
            })
            .finally(() => {
                setLoader(false)
            })

    } else {

        if ((authAPI.isAuthenticated())) {
            activityAPI.get(params.access, params.activity, isAdmin)
                .then(response => {
                    postTreatment(response.data)
                })
                .catch(error => {
                    console.log(error.response)
                    setErrors(error.response)
                })
                .finally(() => {
                    setLoader(false)
                })
        } else history.replace('/login')
    }
}

export const checkActivityFormValidity = (activity, setErrors) => {
    let errorsRslt = []
    let boolRslt = true;

    //title
    if (activity.title && !checkStringLenght(activity.title, 2, 50)){
        errorsRslt["title"] = "error_titlePattern"
        boolRslt = false;
    }else  errorsRslt["lastname"] = undefined

    //multiText
    if(!checkMultiTextHaveText( activity.summary )){
        errorsRslt["summary"] = "summary is required"
        boolRslt = false
    }

    boolRslt ? setErrors({}) : setErrors(errorsRslt)

    return boolRslt
}

export async function asActivityChange(initialActivity, actualActivity, returnOnlyChanges = false) {
    if (returnOnlyChanges) {
        let activityWithChanges = { ...actualActivity };

        //submit only really changes
        if (actualActivity.title === initialActivity.title) activityWithChanges.title = undefined
        if (actualActivity.isPublic === initialActivity.isPublic) activityWithChanges.isPublic = undefined
        if (!await checkMultiTextHaveChange(initialActivity.summary, actualActivity.summary)) activityWithChanges.summary = undefined

        return activityWithChanges

    } else {

        let boolResult = false

        if (
            (actualActivity.title && (actualActivity.title !== initialActivity.title))
            ||(actualActivity.isPublic !== initialActivity.isPublic)
            || await checkMultiTextHaveChange(initialActivity.summary, actualActivity.summary)
            || actualActivity.pictureFile !== undefined
        ) boolResult = true

        return boolResult
    }
}

export function menuItemListForActivity ( activity, isOwner=false, isAdmin=false ) {

        //presentation
        let itemTable = [{ itemName:"presentation", text:"presentation" }]

        //upload
        if(isOwner || isAdmin) { itemTable.push( { itemName:"upload", text:"file" } ) }

        //project
        itemTable.push( { itemName:"project",
                header:"project",
                picture: activity.project && activity.project.picture ? activity.project.picture : undefined,
                text: activity.project && activity.project.title ? activity.project.title : undefined
            }
        )

        //organization
        itemTable.push({ itemName:"organization",
            header:"organization",
            picture: activity.organization && activity.organization.picture ? activity.organization.picture : undefined,
            text: activity.organization && activity.organization.name ? activity.organization.name : undefined
        })

    return itemTable
}
