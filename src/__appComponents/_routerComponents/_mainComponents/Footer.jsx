import React, {useState, useEffect, useContext} from 'react';
import Marquee from "react-fast-marquee";
import '../../../scss/components/footer.scss';
import { withTranslation } from 'react-i18next';

import orgAPI from "../../../__services/_API/orgAPI";
import Picture from "../_pages/__CommonComponents/Picture";
import Ciep_logo from "../../../_resources/logos/CIEP.jpg";
import Eibs_logo from "../../../_resources/logos/EIBS.png";
import {Container, Header, Image, Loader, Segment} from "semantic-ui-react";
import AuthContext from "../../../__appContexts/AuthContext";
import utilities from "../../../__services/utilities";
import eee_banner from "../../../_resources/logos/EEE-banner1280-378-max.png";

const Footer = ({ t }) => {

    const {partnerList, setPartnerList } = useContext(AuthContext)

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
                <Segment basic vertical>
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

