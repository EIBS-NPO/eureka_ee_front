import Axios from "axios";
import {ORG_API} from "../../config";

const getBodyFormData = (org) => {
    let bodyFormData = new FormData();
    if(org.name !== undefined){
        bodyFormData.append('name', org.name)
    }
    if(org.type !== undefined){
        bodyFormData.append('type', org.type)
    }
    if(org.email !== undefined){
        bodyFormData.append('email', org.email)
    }
    if(org.description !== undefined){
        bodyFormData.append('description', JSON.stringify(org.description))
    }
    if(org.phone !== undefined){
        bodyFormData.append('phone', org.phone)
    }
    if(org.id !== undefined){
        bodyFormData.append('id', org.id)
    }
    if(org.pictureFile !== undefined){
        bodyFormData.append('pictureFile', org.pictureFile)
    }
    if(org.address !== undefined){
        bodyFormData.append("address", org.address.address)
        bodyFormData.append("zipCode", org.address.zipCode)
        bodyFormData.append("city", org.address.city)
        bodyFormData.append("country", org.address.country)
        if(org.address.complement !== undefined){
            bodyFormData.append("complement", org.address.complement === "" ? null : org.address.complement)
        }
    }
    if(org.project !== undefined){
        bodyFormData.append("project", org.project.id)
    }if(org.activity !== undefined){
        bodyFormData.append("activity", org.activity.id)
    }
    return bodyFormData
}

//todo add for partner //todo for test
const getUrlParams = (access, org = undefined, admin = undefined) => {
    let params = "?access="+access
    if(admin === true) params += "&admin=1";
    if(access !== "all") {
        if(org) {
            if (org.id) params += "&id=" + org.id
            if (org.name) params += "&name=" + org.name
            if (org.email) params += "&email=" + org.email
            if (org.phone) params += "&phone=" + org.phone

            //only partner //maybe public access //todo
            if(org.partner) params += "&partner=1"

            //by referent relation
            if (org.referent && org.referent.id) params += "&referent_id=" + org.referent.id
            if (org.referent && org.referent.firstname) params += "&referent_firstname=" + org.referent.firstname
            if (org.referent && org.referent.lastname) params += "&referent_lastname=" + org.referent.lastname
            if (org.referent && org.referent.email) params += "&referent_email=" + org.referent.email
        }
    }
    return params
}

const post = (org) => {
    let bodyFormData = getBodyFormData(org)
    return Axios({
        method: 'post',
        url: ORG_API,
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
}

const put = (org, adminManagment = {}) => {

    let bodyFormData = getBodyFormData(org)

    if(adminManagment.length !== 0 ){
        bodyFormData.append("admin", "1")
        if(adminManagment.partner !== undefined){
            bodyFormData.append("partner", adminManagment.partner)
        }
    }

    return Axios({
        method: 'post',
        url: ORG_API+'/update',
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
}

function get(access , org, admin = false){
    return Axios.get(ORG_API + getUrlParams(access, org, admin))

}

function getPublic(access, org){
    return Axios.get(ORG_API + "/public" + getUrlParams(access, org))
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
    get
};
