
import React, {useContext} from 'react';
import utilities from "../_services/utilities";
import { withTranslation } from 'react-i18next';
import AuthContext from "../_contexts/AuthContext";
import {Divider, Grid, Image, Segment, Header, Container} from "semantic-ui-react";

import interreg_carte from "../_resources/carteinterregfwv.png"
import interreg_banniere from "../_resources/interreg_banniere.jpg";

const Home = ({ t }) => {
    const isAuth = useContext(AuthContext).isAuthenticated;
    return (
        <div className="card">
            <Segment vert>
                <Image src={interreg_banniere} />
                <Grid columns={2} stackable textAlign='center'>
                    <Divider ><h1>Eureka Empowerment Environment</h1></Divider>

                    <Grid.Row verticalAlign='middle'>
                        <Grid.Column>

                            <p>Créer, trouver, partager vos ressources</p>
                            <p>Inscrivez votre organisme</p>
                            <p>Dynamiser vos partenariats</p>
                            <p>Faite vivre vos projets</p>
                        </Grid.Column>

                        <Grid.Column>
                            <Image src={interreg_carte} floated="top right" size='big' fluid/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </div>
    );
};

export default withTranslation()(Home);

