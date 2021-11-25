
import authAPI from "../_API/authAPI";
import projectAPI from "../_API/projectAPI";
import {checkMultiTextHaveChange, checkMultiTextHaveText, checkStringLenght} from "../formPatternControl";

export const HandleCreateProject = async ( newProject, postTreatment, setLoader, setErrors, history ) => {

    setLoader(true)
    if(await (authAPI.isAuthenticated())) {
        projectAPI.post( newProject )
            .then(response => {
                postTreatment(response.data[0])
            })
            .catch(error => {
                console.log(error.response.data) //todo remove
                setErrors(error.response.data);
            })
            .finally(()=>{
                setLoader(false)
            })
    }else {
        history.replace('/login')
    }
}

export const HandleUpdateProject = async ( updatedProject, postTreatment, setLoader, setErrors, history, isAdmin= false) => {

    setLoader(true);

    if(await (authAPI.isAuthenticated())) {
        let adminManagment = isAdmin ? { admin : true } : undefined

        projectAPI.put(updatedProject, adminManagment)
            .then(response => {
                postTreatment( response.data[0] )
            })
            .catch(error => {
                console.log(error) //todo remove
                setErrors(error.response.data)
            })
            .finally(()=> {
                setLoader(false)
            })

    }else history.replace('/login')
}

export const HandleGetProjects = async (params, postTreatment, setLoader, setErrors, history = undefined, isAdmin = false) => {
    setLoader(true)
    if (params.access === 'public') {
        if(!params.project) params.access = "all"

        await projectAPI.getPublic(params.access, params.project)
            .then(response => {
                postTreatment(response.data)
            })
            .catch(error => {
                console.log(error)//todo remove
                setErrors(error.response.data)
            })
            .finally(() => setLoader(false))
    } else {
        if (authAPI.isAuthenticated()) {
           await projectAPI.get(params.access, params.project, isAdmin)
                .then(response => {
                    postTreatment(response.data)
                })
                .catch(error => {
                    console.log(error) //todo remove
                    setErrors(error.response.data)
                })
                .finally(async () => {
                    await setLoader(false)
                })
        } else history.replace('/login')
    }
}


export const checkProjectFormValidity = ( project, setErrors) => {
    let errorsRslt = []
    let boolRslt = true

    //title
    if (project.title && !checkStringLenght(project.title, 2, 50)){
        errorsRslt["title"] = "error_titlePattern"
        boolRslt = false;
    }else  errorsRslt["title"] = undefined

    //description
    if(!checkMultiTextHaveText( project.description )){
        errorsRslt["description"] = "description is required"
        boolRslt = false
    }

    boolRslt ? setErrors( {} ) : setErrors( errorsRslt )

    return boolRslt
}

export async function checkProjectChanges( actualProject, initialProject, returnOnlyChanges = false){

    if(returnOnlyChanges) {

        let projectWithChanges = { ...actualProject }
        //submit only really changes
        if (actualProject.title === initialProject.title) projectWithChanges.title = undefined
        if ( ( actualProject.startDate || actualProject.startDate === '' ) && actualProject.startDate === initialProject.startDate) projectWithChanges.startDate = undefined
        if ( ( actualProject.endDate || actualProject.endDate === '' ) && actualProject.endDate === initialProject.endDate) projectWithChanges.endDate = undefined
        if(!await checkMultiTextHaveChange(initialProject.description, actualProject.description)) projectWithChanges.description = undefined

        return projectWithChanges

    } else {

        let boolResult = false

        if(
            (actualProject.title && actualProject.title !== initialProject.title)
            || await checkMultiTextHaveChange(initialProject.description, actualProject.description)
            || (( actualProject.startDate || actualProject.startDate === '' ) && actualProject.startDate !== initialProject.startDate)
            || (( actualProject.endDate || actualProject.endDate === '' ) && actualProject.endDate !== initialProject.endDate)
            || actualProject.pictureFile !== undefined
        ) boolResult = true

        return boolResult
    }
}

export function menuItemListForProject ( project, isOwner=false, isAdmin=false){
    //presentation
    let itemTable = [{ itemName:"presentation", text:"presentation" }]

    //team
    itemTable.push( { itemName:"team", text:"team" } )

    //organization
    itemTable.push( { itemName:"organization",
            header:"organization",
            picture: project.organization && project.organization.picture ? project.organization.picture : undefined,
            text: project.organization && project.organization.name ? project.organization.name : undefined
        }
    )

    //activities
    itemTable.push( { itemName:"activities", header:"activities" } )

    return itemTable
}
