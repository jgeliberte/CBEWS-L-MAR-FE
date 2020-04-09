import React, { Fragment, useEffect, useState } from 'react';
import { Container, Grid, Typography, Box } from '@material-ui/core'
import { useStyles } from '../styles/general_styles';
import AppConfig from '../reducers/AppConfig';

function Home() {
    const classes = useStyles();
    const site_id = AppConfig.CONFIG.site_id;
    const [alert_level, setAlertLevel] = useState([0, "alert_level_0"]);
    const [triggers, setTriggers] = useState([]);

    useEffect(() => {
        fetch(`${AppConfig.HOSTNAME}/api/alert_gen/public_alerts/get_site_current_status/${site_id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json()
        ).then(response => {
            if (response.ok) {
                console.log("JSON DATA", response.data);
                if (response.data !== null) {
                    const { public_alert_level, latest_event_triggers } = response.data;
                    setAlertLevel(public_alert_level);
                    setTriggers(latest_event_triggers);
                }
            }
            else console.error("Problem in deleteMaintenanceLog backend");
        }).catch(error => console.error(error));
    }, []);

    return (
        <Fragment>
            <Container>
                <Grid container style={{ marginTop: '5%', marginBottom: '5%' }}>
                    <Grid item xs={12} align="center">
                        <Typography variant="h2" className={classes[`${alert_level[1]}`]}>
                            Alert {alert_level[0]}
                        </Typography>
                    </Grid>
                    {
                        triggers.length > 0 ? (
                            <Fragment>
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
                            </Fragment>
                        ) : (
                            <Grid item xs={12} align="center">
                                <Box className={classes.info_padding}>
                                    <Typography variant="h5" >
                                        No ongoing event on site.
                                    </Typography>
                                </Box>
                            </Grid>
                        )
                    }
                </Grid>
            </Container>
        </Fragment>
    )
}

export default Home