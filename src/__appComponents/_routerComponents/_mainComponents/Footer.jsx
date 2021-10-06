import React, {useState, useEffect, useContext} from 'react';
import Marquee from "react-fast-marquee";
import '../../../scss/components/footer.scss';
import { withTranslation } from 'react-i18next';

import orgAPI from "../../../__services/_API/orgAPI";
import Picture from "../_pages/__CommonComponents/Picture";
import {Container, Header, Segment} from "semantic-ui-react";
import AuthContext from "../../../__appContexts/AuthContext";
import utilities from "../../../__services/utilities";

const Footer = ({ t }) => {

    //le context provoque un rechargement de la page
//    const {partnerList, setPartnerList } = useContext(AuthContext)

    const [partnerList, setPartnerList] = useState([])
    const [loader, setLoader] = useState(false)
    const [error, setError] = useState(false)

    useEffect(()=> {
        setLoader(true)
        orgAPI.getPublic(null, true)
            .then(response => {
                setPartnerList(response.data)
            })
            .catch(error => setError(true))
            .finally(() => setLoader(false))
    }, [])
    return (
        <Container className="footer">
            {/*<Segment basic textAlign='center'>*/}
                <Segment basic vertical loading={loader}>
                    <Header size='medium' textAlign='center'>{utilities.strUcFirst(t("partners"))}</Header>
                    {/* <h4>{t("partners")}</h4>*/}
                    {!loader && !error &&
                    <Marquee play={true} pauseOnHover={true} direction={"left"} speed={40}>
                        {partnerList.length > 0 &&
                        partnerList.map((partner, key) => (
                            <Picture key={key} picture={partner.picture} size={"tiny"} isLocal={true} isLink={true}
                                     linkTo={"#"}/>
                        ))
                        }
                    </Marquee>
                    }
                </Segment>


           {/* {!loader && error &&
                <p>Loading Error</p>
            }*/}
                {/*<Segment className="banner" basic textAlign='center' >
                    <Image
                        alt='Eureka-Empowerment-Environment Eureka-Interreg V FWVL'
                        src={eee_banner}
                    />
                </Segment>*/}
           {/* </Segment>*/}

          {/*  {loader &&
            <Segment>
                <Loader
                    active
                    content={
                        <p>{ t('loading') +" : " +  t('partner') }</p>
                    }
                    inline="centered"
                />
            </Segment>
            }*/}
        </Container>
    );
};

export default withTranslation()(Footer);

