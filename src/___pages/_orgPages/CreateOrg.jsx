
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

            await HandleCreateOrg( newOrg, postTreatment, setLoader, setErrors, history)
        }
 //       if (address.address) { org.address = address}
        //   setOrg({...org, description: desc})
      //  handleSubmit()
    }

    const postTreatment = ( orgResult, urlMsg ) => {
        history.replace("/org/owned_" + orgResult.id + urlMsg)
    }

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

