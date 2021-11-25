
import { withTranslation } from 'react-i18next';
import {Container, Grid, Header, Image, Segment} from "semantic-ui-react";

import interreg_carte from "../_resources/carteinterregfwv.png"
import eee_logo from "../_resources/logos/icone-eureka.png"

const HomePage = ( ) => {

    return (
        <div className="card">
            <Segment basic>
                <Grid  stackable textAlign="center">
                    <Grid.Row columns={1}>
                        <Header as='h1' icon>
                            <Image
                                alt="Eureka Empowerment environment logo"
                                src={eee_logo}
                                as='a'
                                href="/"
                            />
                            Eureka Empowerment Environment
                            <Header.Subheader>
                                Inscrivez-vous, partagez, collaborez, échangez, enrichissez-vous !
                            </Header.Subheader>
                        </Header>
                    </Grid.Row>

                    <Grid.Row verticalAlign='middle' columns={2}>
                        <Grid.Column>
                            <Container>
                                Application Eureka de partage de projet

                                Eureka Empowerment Environment est une application web permettant de faciliter l’échange d’outils sur l’engagement des citoyens.

                                Accessible à tous, l’application doit également permettre des collaborations aisées entre plusieurs personnes via le partage d’expériences.

                                Cette plateforme a pour vocation de mettre à disposition les outils créés dans le cadre du projet, que ce soit les outils d’animations pédagogiques, les contenus de formation mais aussi les rapportages et les évaluations d’impact

                            </Container>{/*
                            <p>Créer, trouver, partager vos ressources</p>
                            <p>Inscrivez votre organisme</p>
                            <p>Dynamiser vos partenariats</p>
                            <p>Faite vivre vos projets</p>*/}
                        </Grid.Column>

                        <Grid.Column>
                            <Image src={interreg_carte} floated="right" size='big' />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </div>
    );
};

export default withTranslation()(HomePage);

