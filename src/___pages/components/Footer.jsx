import React, {useState, useEffect } from 'react';
import Marquee from "react-fast-marquee";
import '../../scss/components/footer.scss';
import {useTranslation, withTranslation} from 'react-i18next';

import {Container, Header, Image, Segment} from "semantic-ui-react";
import utilities from "../../__services/utilities";

import {HandleGetOrgs} from "../../__services/_Entity/organizationServices";
import {OrgPartnerCard} from "./entityViews/OrganizationViews";

const Footer = (props) => {

    const { t } = useTranslation()

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
    }, [])

    return (
        <Container className="footer unmarged">
                <Segment className="unpadded" basic vertical loading={loader}>
                    <Header className="unmarged" size='medium' textAlign='center'>{utilities.strUcFirst(t("partners"))}</Header>
                    {!loader && !error &&
                    <Marquee play={true} pauseOnHover={true} direction={"left"} speed={40} gradient={false}>
                        {partners && partners.length > 0 &&
                        partners.map((partner, key) => (
                            <OrgPartnerCard key={key} org={partner} />
                        ))
                        }
                    </Marquee>
                    }
                </Segment>
        </Container>
    );
};

export default withTranslation()(Footer);

