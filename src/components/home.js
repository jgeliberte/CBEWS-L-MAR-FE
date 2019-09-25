import React, { Fragment } from 'react';
import { Container, Grid, Typography, makeStyles, Box } from '@material-ui/core'


const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    margin: {
        margin: theme.spacing(1),
    },
    menu_functions: {
        paddingTop: '10%'
    },
    button_fluid: {
        width: '90%',
        padding: 10
    },
    info_padding: {
        padding: 20
    },
    alert_level: {
        color: '#f09e01'
    }
}));

function Home() {
    const classes = useStyles();

    return (
        <Fragment>
            <Container>
                <Grid container style={{ marginTop: '5%', marginBottom: '5%' }}>
                    <Grid item xs={12} align="center">
                        <Typography variant="h2" className={classes.alert_level}>
                            Alert 2
                        </Typography>
                    </Grid>
                    <Grid item xs={6} align="center">
                        <Box className={classes.info_padding}>
                            <Typography variant="h5" >
                                Latest Rainfall Data
                                </Typography>
                            <Typography variant="h6">
                                1-day cumulative rainfall: 98mm (171% of threshold)
                                </Typography>
                            <Typography variant="h6">
                                3-day cumulative rainfall: 100mm (86% of threshold)
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} align="center">
                        <Box className={classes.info_padding}>
                            <Typography variant="h5" >
                                Latest Subsurface Data
                        </Typography>
                            <Typography variant="h6">
                                Nodes: 1, 2, 3, 4 shows noticeable movements downslope and across slope.
                        </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} align="center">
                        <Box className={classes.info_padding}>
                            <Typography variant="h5" >
                                Latest Ground Measurement Data
                            </Typography>
                            <Typography variant="h6">
                                No significant movements observed.
                        </Typography>
                        </Box>

                    </Grid>
                    <Grid item xs={6} align="center">
                        <Box className={classes.info_padding}>
                            <Typography variant="h5" >
                                Latest Manifestations of Movements (MOMs) report
                            </Typography>
                            <Typography variant="h6">
                                New Cracks has been observed near Crack C.
                        </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Fragment>
    )
}

export default Home