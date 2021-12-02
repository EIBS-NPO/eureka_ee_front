
import { withTranslation } from 'react-i18next';
import {Container, Grid, Header, Image, List, Segment} from "semantic-ui-react";

import interreg_carte from "../_resources/carteinterregfwv.png"
import eee_logo from "../_resources/logos/icone-eureka.png"

const HomePage = ( props ) => {

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

                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <Container>
                                <p> { props.t('eee_home_1') } </p>

                                <p> { props.t('eee_home_2') } </p>

                                <List>
                                    <List.Content>
                                        <List.Item> { props.t('eee_home_3') } </List.Item>

                                        <List.List>
                                            <List.Content>
                                                <List.Item> { props.t('eee_home_4') } </List.Item>
                                                <List.Item>{ props.t('eee_home_5') }</List.Item>
                                                <List.Item> { props.t('eee_home_6') }</List.Item>

                                            </List.Content>
                                        </List.List>

                                        <List.List>
                                            <List.Content>
                                                <List.Item>{ props.t('eee_home_7') }</List.Item>
                                                <List.Item> { props.t('eee_home_8') }</List.Item>
                                                <List.Item> { props.t('eee_home_9') }</List.Item>
                                            </List.Content>
                                        </List.List>

                                        <List.List>
                                            <List.Content>
                                                <List.Item> { props.t('eee_home_10') }</List.Item>
                                                <List.Item> { props.t('eee_home_11') }</List.Item>
                                                <List.Item> { props.t('eee_home_12') }</List.Item>
                                                <List.Item> { props.t('eee_home_13') }</List.Item>
                                                <List.Item> { props.t('eee_home_14') }</List.Item>
                                            </List.Content>
                                        </List.List>

                                    </List.Content>
                                </List>

                                <p>{ props.t('eee_home_15') }</p>

                                <p> { props.t('eee_home_16') }
                                    <a href="https://github.com/EIBS-NPO/">https://github.com/EIBS-NPO/</a></p>

                            </Container>
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

