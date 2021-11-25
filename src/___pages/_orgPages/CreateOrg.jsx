
import React, { useState} from "react";
import { withTranslation } from 'react-i18next';
import { Segment, Loader} from "semantic-ui-react";

import PictureForm from "../components/forms/picture/PictureForm";
import {checkOrgFormValidity, HandleCreateOrg} from "../../__services/_Entity/organizationServices";
import {CreateOrgForm} from "../components/entityForms/OrgForms";

const CreateOrg = ({ history, t }) => {

    const [loader, setLoader] = useState(false)
    const [org, setOrg] = useState({
        picture:undefined,
        name: "",
        type: "",
        description: {
            "en-GB":"",
            "fr-FR":"",
            "nl-BE":""
        },
        email: "",
        phone: "",
        address: undefined
    });

    const preSubmit = async ( newOrg ) => {
        //todo checkValidity
        //todo verif handle address?
        if(checkOrgFormValidity( newOrg, setErrors )){

            HandleCreateOrg( newOrg, postTreatment, setLoader, setErrors, history)
        }
 //       if (address.address) { org.address = address}
        //   setOrg({...org, description: desc})
      //  handleSubmit()
    }

    const postTreatment = ( orgResult, urlMsg ) => {
        history.replace("/org/owned_" + orgResult.id + urlMsg)
    }
    /*const handleSubmit = async() => {
        setLoader(true)
        let newOrg
        let urlMsg = ""

        if(await (authAPI.isAuthenticated())) {
            let response = await OrgAPI.post(org)
                .catch(error => {
                    console.log(error.response.data)
                    setErrors(error.response.data);
                })
            if (response && response.status >= 200 && response.status < 300) {
                switch (response.status) {
                    case 206 :
                        newOrg = response.data[1]
                        urlMsg = "_" + response.data[0].split(" : ")[2];
                        break;
                    default :
                        newOrg = response.data[0]
                }
            }else {
                history.replace('/login')
            }
        }

        history.replace("/org/owned_" + newOrg.id + urlMsg)
    };*/

    const [errors, setErrors] = useState({
        name: "",
        description:"",
        type: "",
        email: "",
        phone: "",
    });

    return (
        <div className="card">
            <h1> {t('new_org')} </h1>
            {!loader &&
                <>
                    <Segment>
                        <PictureForm entityType="org" entity={org} setter={setOrg} />
                    </Segment>

                    <CreateOrgForm org={org} setOrg={setOrg} handleSubmit={preSubmit} loader={loader} errors={errors}/>
                </>

            }
            {loader &&
            <Segment>
                <Loader
                    active
                    content={
                        <p>{t('loading') +" : " + t('creation') }</p>
                    }
                    inline="centered"
                />
            </Segment>
            }
        </div>
    );
};

export default withTranslation()(CreateOrg);

