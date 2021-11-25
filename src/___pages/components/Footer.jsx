import React, {useState, useEffect, useContext} from 'react';
import Marquee from "react-fast-marquee";
import '../../scss/components/footer.scss';
import {useTranslation, withTranslation} from 'react-i18next';

import Picture from "./Picture";
import {Container, Header, Image, Segment} from "semantic-ui-react";
import utilities from "../../__services/utilities";
import AuthContext from "../../__appContexts/AuthContext";

import eee_banner from "../../_resources/logos/EEE-banner1280-378-max.png"
import {HandleGetOrgs} from "../../__services/_Entity/organizationServices";
import {OrgPartnerCard} from "./entityViews/OrganizationViews";

const Footer = (props) => {

    const { t } = useTranslation()
    //todo refresh not works
    //le context provoque un rechargement de la page
 //   const { partnerList } = useContext(AuthContext).partnerList
//console.log(partnerList)
    const [partners, setPartners] = useState([])
    const [loader, setLoader] = useState(false)
    const [error, setError] = useState(false)

    useEffect(()=> {
        HandleGetOrgs(
            {access:"public", org:{partner:true}},
            setPartners,
            setLoader,
            setError,
            props.history
        )
     //   console.log(partnerList)
     //   setPartners(partnerList)
    }, [])
    //todo context for refresh footer ?

    return (
        <Container className="footer unmarged">
       {/* <Container className="footer">*/}
            {/*<Segment basic textAlign='center'>*/}
                <Segment className="unpadded" basic vertical loading={loader}>
                    <Header className="unmarged" size='medium' textAlign='center'>{utilities.strUcFirst(t("partners"))}</Header>
                    {/* <h4>{t("partners")}</h4>*/}
                    {!loader && !error &&
                    <Marquee play={true} pauseOnHover={true} direction={"left"} speed={40}>
                        {partners && partners.length > 0 &&
                        partners.map((partner, key) => (
                            <OrgPartnerCard key={key} org={partner} />
                           /* <Picture
                                className="margAuto"
                                key={key}
                                picture={partner.picture}
                                size={"tiny"}
                                isLocal={true}
                                isLink={true}
                                linkTo={"#"}
                            />*/
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

           {/*    <Segment className="banner" basic textAlign='center'>*/}
             {/*  <Segment basic textAlign='center'>
                    <Image
                        alt='Eureka-Empowerment-Environment Eureka-Interreg V FWVL'
                        src={eee_banner}
                    />
                </Segment>*/}

        </Container>
    );
};

export default withTranslation()(Footer);

