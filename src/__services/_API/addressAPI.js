import Axios from "axios";
import { ADRS_API } from "../../config";

function post(type, id, address) {

    let data = {
        "address": address.address,
        "country": address.country,
        "city": address.city,
        "zipCode": address.zipCode
    }
    if(type === "org"){data["orgId"] = id}
    else if(type === "user"){data["userId"] = id}
    return Axios.post(ADRS_API, data)
}

function put(address) {


    let data = {
        "id":address.id,
        "address": address.address,
        "country": address.country,
        "city": address.city,
        "zipCode": address.zipCode
    }
    return Axios.put(ADRS_API, data)
}

function get(id = null){
    if(id !== null){ return Axios.get(ADRS_API + "?id="+ id) }
    return Axios.get( ADRS_API )
}

function remove(id){
    return Axios.delete( ADRS_API + "?=" + id )
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    post,
    put,
    get,
    remove
};