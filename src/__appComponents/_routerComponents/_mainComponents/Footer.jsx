import React, {useState, useEffect } from 'react';
import Marquee from "react-fast-marquee";
import '../../../scss/components/footer.scss';
import { withTranslation } from 'react-i18next';

import orgAPI from "../../../__services/_API/orgAPI";
import Picture from "../_pages/__CommonComponents/Picture";
import Ciep_logo from "../../../_resources/logos/CIEP.jpg";
import Eibs_logo from "../../../_resources/logos/EIBS.png";
import {Loader, Segment} from "semantic-ui-react";

const Footer = ({ t }) => {

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
        <div className="footer">
            <Segment>
            <h4>Organisations partenaires</h4>
            {!loader && !error &&
                <Marquee play={true} pauseOnHover={true} direction={"left"} speed ={40}>
                    {partnerList.length > 0 &&
                        partnerList.map((partner, key) => (
                            <Picture key={key} picture={partner.picture} size={"tiny"} isLocal={true} isLink={true}
                                     linkTo={"#"}/>
                        ))
                    }
                </Marquee>
            }

            {!loader && error &&
                <p>Loading Error</p>
            }
            </Segment>

            {loader &&
            <Segment>
                <Loader
                    active
                    content={
                        <p>{ t('loading') +" : " +  t('partner') }</p>
                    }
                    inline="centered"
                />
            </Segment>
            }
        </div>
    );
};

export default withTranslation()(Footer);

