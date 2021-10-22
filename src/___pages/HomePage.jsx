
import { withTranslation } from 'react-i18next';
import {Divider, Grid, Image, Segment } from "semantic-ui-react";

import interreg_carte from "../_resources/carteinterregfwv.png"
import interreg_banniere from "../_resources/interreg_banniere.jpg";

const HomePage = ( ) => {
 //   const isAuth = useContext(AuthContext).isAuthenticated;
    return (
        <div className="card">
            <Segment vertical>
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
                            <Image src={interreg_carte} floated="right" size='big' />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </div>
    );
};

export default withTranslation()(HomePage);

