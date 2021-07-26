import React from 'react';
import Marquee from "react-fast-marquee";
import '../../scss/components/footer.scss';
import { withTranslation } from 'react-i18next';

import Picture from "../Picture";
import Ciep_logo from "../../_resources/logos/CIEP.jpg";
import Eibs_logo from "../../_resources/logos/EIBS.png";

const Footer = ({ t }) => {

    //todo recup org partner by requete préparée
    //todo make an array with picture link for org partner
    //todo composant partner
    return (
        <div className="footer">
            <h4>Organisations partenaires</h4>
            <Marquee
                play={true}
                pauseOnHover={true}
                direction={"left"}
                speed ={40}
            >
                <Picture picture={Ciep_logo} size={"tiny"} isLocal={true} isLink={true} linkTo={"#"}/>
                <Picture picture={Eibs_logo} size={"tiny"} isLocal={true}/>
            </Marquee>
            {/* <nav>
                <ul>
                    <li><NavLink to="/beweging">Beweging</NavLink></li>
                </ul>
            </nav>*/}
        </div>
    );
};

export default withTranslation()(Footer);

