
import React, {useContext, useEffect, useState} from "react";
import {Form, Input, Loader} from "semantic-ui-react";
import {withTranslation} from "react-i18next";
import authAPI from "../../../__services/_API/authAPI";
import userAPI from "../../../__services/_API/userAPI";


const Page404 = (props) => {

    useEffect(()=>{

            props.history.replace('/');


    },[])

}

export default withTranslation()(Page404);