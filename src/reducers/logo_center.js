import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import CardMedia from '@material-ui/core/CardMedia';

export default class LogoCenter extends Component {
    render() {
        const styles = {
            media: {
                height: 200,
                width: 200
            }
        };
        return (
            <Container style={{margin: 20}}>
                <Grid container spacing={0} alignItems="center" justify="center">
                    <Grid item xs={2}>
                        <CardMedia
                            image={require('../assets/dost_seal.png')}
                            style={styles.media}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <CardMedia
                            image={require('../assets/dynaslope_seal.png')}
                            style={styles.media}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <CardMedia
                            image={require('../assets/mar_seal.png')}
                            style={styles.media}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <CardMedia
                            image={require('../assets/leon_seal.png')}
                            style={styles.media}
                        />
                    </Grid>
                </Grid>
            </Container>
        );
    }
}
