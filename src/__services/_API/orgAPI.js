import Axios from "axios";
import {ORG_API} from "../../config";

function post(org) {

    let bodyFormData = new FormData();
    bodyFormData.append('name', org.name)
    bodyFormData.append('type', org.type)
    bodyFormData.append('email', org.email)
    bodyFormData.append('phone', org.phone)
    bodyFormData.append('description', JSON.stringify(org.description))
    if(org.picture !== undefined){
        bodyFormData.append('pictureFile', org.picture)
    }
    if(org.address !== undefined){
        bodyFormData.append("address", org.address.address)
        bodyFormData.append("complement", org.address.complement)
        bodyFormData.append("zipCode", org.address.zipCode)
        bodyFormData.append("city", org.address.city)
        bodyFormData.append("country", org.address.country)
    }
    return Axios({
        method: 'post',
        url: ORG_API,
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
}

function put(org) {
    let data = {
          "orgId" : org.id,
          "name" : org.name,
          "type": org.type,
          "email": org.email,
          "phone" : org.phone,
          'description': org.description
      }
      if(org.partner !== undefined){
          data["isPartner"] = org.partner
      }
      return Axios.put(ORG_API, data)
}

function getPublic(id = null, isPartner=null){
    let endPoint = ORG_API;
    if(id === null){
        if(isPartner !== null){
            endPoint += "/public?partner"
        }
        else{
            endPoint += "/public";
        }
    }else {
        endPoint += "/public?id=" + id;
    }
    return Axios.get(endPoint)
}

function getOrg(access =null, id =null){
    let params = "?";
    if(access !== null){ params += "access=" + access }
    if(id !== null){
        if( params !== "" ) { params += "&"}
        params += "id=" + id
    }
    if(params === "?" ){
        return Axios.get(ORG_API )
    }else {
        return Axios.get(ORG_API + params)
    }
}

const uploadPic = (bodyFormData) => {
    return Axios({
        method: 'post',
        url: ORG_API + "/picture",
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
}

//todo useless?
const downloadPic = (picture) => {
    return Axios.get(ORG_API + "/picture/?pic=" + picture)
}

const manageActivity = (activity, orgId) => {
    return Axios.put(ORG_API + "/manageActivity", {
            orgId: orgId,
            activityId: activity.id
        })
}

const manageProject = (project, orgId) => {
    return Axios.put(ORG_API + "/manageProject", {
        orgId: orgId,
        projectId: project.id
    })
}

const getMembered = () => {
    return Axios.get(ORG_API + "/membered")
}

const remove = (orgId) => {
    return Axios.delete(ORG_API + "?orgId=" + orgId)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    post,
    put,
    remove,
    getPublic,
    getOrg,
    uploadPic,
    downloadPic,
    manageActivity,
    manageProject,
    getMembered
};
