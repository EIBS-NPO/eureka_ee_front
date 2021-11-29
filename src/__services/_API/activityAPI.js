
import Axios from "axios";
import {ACT_API, API_URL } from "../../config";

const getBodyFormData = (activity) => {
    //todo add if
    let bodyFormData = new FormData();
    if(activity.id !== undefined){
        bodyFormData.append('id', activity.id)
    }
    if(activity.title !== undefined){
        bodyFormData.append('title', activity.title)
    }
    if(activity.isPublic !== undefined){
        bodyFormData.append('isPublic', activity.isPublic)
    }
    if(activity.summary !== undefined){
        bodyFormData.append('summary', JSON.stringify(activity.summary))
    }
    if(activity.pictureFile !== undefined){
        bodyFormData.append('pictureFile', activity.pictureFile)
    }
    if(activity.file !== undefined){
        bodyFormData.append('file', activity.file)
    }
    if(activity.organization !== undefined){
        let org = activity.organization === null ? null : activity.organization.id
        bodyFormData.append('organization', org)
    }
    if(activity.project !== undefined){
        let project = activity.project === null ? null : activity.project.id
        bodyFormData.append('project', project)
    }
    if(activity.follow !== undefined){
        bodyFormData.append('follow', "true")
    }
    return bodyFormData;
}

const getUrlParams = (access, activity = undefined, admin = undefined) => {

    let params = "?access="+access
    if(admin === true) params += "&admin=1";
    if(access !== "all") {
        if (activity) {
            if (activity.id) params += "&id=" + activity.id
            if (activity.title) params += "&title=" + activity.title

            //by creator
            if (activity.creator) {
                if (activity.creator.id) params += "&creator_id=" + activity.creator.id
                if (activity.creator.firstname) params += "&creator_firstname=" + activity.creator.firstname
                if (activity.creator.lastname) params += "&creator_lastname=" + activity.creator.lastname
                if (activity.creator.email) params += "&creator_email=" + activity.creator.email
            }

            //by project
            if (activity.project) {
                if (activity.project.id) params += "&project_id=" + activity.project.id
                if (activity.project.title) params += "&project_title=" + activity.project.title
            }

            //by org
            if (activity.organization) {
                if (activity.organization.id) params += "&organization_id=" + activity.organization.id
                if (activity.organization.name) params += "&organization_name=" + activity.organization.name
                if (activity.organization.email) params += "&organization_email=" + activity.organization.email
            }
        }
    }

    return params
}

const post = (activity) => {
    let bodyFormData = getBodyFormData(activity)
    return Axios({
        method: 'post',
        url: ACT_API,
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
}

const put = (activity, adminManagment) => {
    let bodyFormData = getBodyFormData(activity)

    if( adminManagment.admin ) {
        bodyFormData.append("admin", "1")
    }

    return Axios({
        method: 'post',
        url: ACT_API+"/update",
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
}

const get = (access, activity, admin = false) => {
    return Axios.get(ACT_API + getUrlParams(access, activity, admin))
}

const getPublic = (access, activity) => {
    return Axios.get(ACT_API + "/public" + getUrlParams(access, activity))
}

const download = (activity, admin = false) => {
    let urlParams = ""
    if( activity.isPublic && admin === false ) urlParams += "/public"
    urlParams += "?id=" + activity.id
    if( admin ) urlParams += "&admin=1"
    return Axios.get(ACT_API + "/download" + urlParams,
        {responseType: 'arraybuffer'}
    )
}
/*const download = (isPublic, id, access) => {
    let url = "/activity/download"
    if(isPublic){
        url += "/public"
    }
     url += "?id=" +id+ "&access=" +access
    return Axios.get(API_URL +url,
        {responseType: 'arraybuffer'}
    )
}*/

const remove = (id) => {
    return Axios.delete(ACT_API + "?id=" + id)
}


//todo place upload here

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    post,
    put,
    get,
    getPublic,
    download,
    remove
};
