import React from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import CardMedia from '@material-ui/core/CardMedia';

const login_styles = {
    media: {
        height: 200,
        width: 200
    }
};

const img_styles = {
    media: {
        height: 75,
        width: 75
    }
};

function LogoCenter() {

    return (
        <Container style={{ margin: 20 }}>
            <Grid container spacing={0} alignItems="center" justify="center">
                <Grid item xs={2}>
                    <CardMedia
                        image={require('../assets/dost_seal.png')}
                        style={login_styles.media}
                    />
                </Grid>
                <Grid item xs={2}>
                    <CardMedia
                        image={require('../assets/dynaslope_seal.png')}
                        style={login_styles.media}
                    />
                </Grid>

                <Grid item xs={2}>
                    <CardMedia
                        image={require('../assets/mar_seal.png')}
                        style={login_styles.media}
                    />
                </Grid>

                <Grid item xs={2}>
                    <CardMedia
                        image={require('../assets/leon_seal.png')}
                        style={login_styles.media}
                    />
                </Grid>
            </Grid>
        </Container>
    );
}

function LogoAppBar() {
    return (
        <Container style={{ margin: 10 }}>
            <Grid container spacing={0}>
                <Grid item xs={1}>
                    <CardMedia
                        image={require('../assets/dost_seal.png')}
                        style={img_styles.media}
                    />
                </Grid>
                <Grid item xs={1}>
                    <CardMedia
                        image={require('../assets/dynaslope_seal.png')}
                        style={img_styles.media}
                    />
                </Grid>

                <Grid item xs={1}>
                    <CardMedia
                        image={require('../assets/mar_seal.png')}
                        style={img_styles.media}
                    />
                </Grid>

                <Grid item xs={1}>
                    <CardMedia
                        image={require('../assets/leon_seal.png')}
                        style={img_styles.media}
                    />
                </Grid>
            </Grid>
        </Container>
    );
}

export {
    LogoCenter, LogoAppBar
}
