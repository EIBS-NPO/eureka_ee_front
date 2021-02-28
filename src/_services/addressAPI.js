import Axios from "axios";
import { ADRS_API } from "../config";

function post(address) {
    return Axios.post(ADRS_API, address)
}

function put(address) {
    console.log(address)
    return Axios.put(ADRS_API, address)
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