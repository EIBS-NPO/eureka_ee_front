
import React, {useEffect, useState, useContext} from 'react';
import {Container, Segment, Message } from "semantic-ui-react";
import {withTranslation} from "react-i18next";
import AuthContext from "../../__appContexts/AuthContext";
import {HandleGetOrgs } from "../../__services/_Entity/organizationServices";
import {LoaderWithMsg} from "../components/Loader";
import {DisplayOrg} from "../components/ManageOrg";


const OrgPage_Profile = (props) => {
    const {email, isAuthenticated} = useContext(AuthContext);
    const urlParams = props.match.params.id.split('_')
    const checkCtx = () => {
        if(urlParams[0] === 'public' || urlParams[0] === 'owned' || urlParams[0] === 'assigned'){
            if ( urlParams[0] !=="public" && !isAuthenticated ) {
                //if ctx need auth && have no Auth, public context is forced
                props.history.replace('/login')
            } else {return urlParams[0]}
        }else return '';
    }

    const [ctx, setCtx] = useState()
    const [org, setOrg ] = useState({})
    const [isReferent, setIsReferent] = useState(false)

    const [loader, setLoader] = useState(false);

    //todo
    const [message, setMessage] = useState(undefined)

    //todo errors
    const [errors, setErrors] = useState(false)

    /**
     * setup isReferent ad org's data from API
     * @param orgResult
     * @returns {Promise<void>}
     */
    const postTreatment = async (orgResult) => {
        let referent = orgResult[0] && orgResult[0].referent && email === orgResult[0].referent.email
        await setIsReferent( referent )
        await setOrg(orgResult[0])
    }

    /**
     * check the context asked
     * handle setup url message
     * handle get request for organization targeted
     */
    useEffect(() => {

        async function fetchData () {
            let ctx = checkCtx()
            setCtx(ctx)
            if(urlParams[2]){
                setMessage(urlParams[2])
            }

            await HandleGetOrgs(
                {access:ctx, project:{id:urlParams[1]}},
                postTreatment,
                setLoader,
                setErrors,
                false,
                props.history
            )
        }

        fetchData()

        //dismiss unmounted warning
        return () => {
            setIsReferent(false);
            setOrg({});
        };
    }, []);

    return (
        <Segment className="card">
            <LoaderWithMsg
                isActive={loader}
                msg={props.t('loading') +" : " + props.t('organization') }
            />
            {!loader &&
                <>
                {org ?
              //      <>
             //           <OrgHeader message={message} org={org} />

                        <DisplayOrg
                            t={props.t}
                            ctx={ctx}
                            isOwner={isReferent}
                            org={org}
                            setOrg={setOrg}
                            loader={loader}
                            history={props.history}
                        />
           //         </>
                    :
                    <Container textAlign='center'>
                        <Message size='mini' info>
                            {props.t("no_result")}
                        </Message>
                    </Container>
                }
            </>
            }
        </Segment>
    );
};

export default withTranslation()(OrgPage_Profile);