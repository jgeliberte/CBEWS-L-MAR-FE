import React, { Fragment, useEffect, useState } from 'react';
import { Container, Grid, Typography, Box } from '@material-ui/core';
import moment from "moment";
import { useStyles } from '../styles/general_styles';
import AppConfig from '../reducers/AppConfig';

function Home() {
    const classes = useStyles();
    const site_id = AppConfig.CONFIG.site_id;
    const [alert_level, setAlertLevel] = useState([0, "alert_level_0"]);
    const [db_alert_data, setDBAlertData] = useState(null);
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
                console.log("JSON DATA", response);
                if (response.data !== null) {
                    const { public_alert_level, latest_event_triggers } = response.data;
                    setAlertLevel([public_alert_level, `alert_level_${public_alert_level}`]);
                    setTriggers(latest_event_triggers);
                    setDBAlertData(response.data);
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
                        db_alert_data !== null && (
                            <Fragment>
                                <Grid item xs={12} align="center">
                                    <Typography variant="h5" className={[classes.label_paddings]}>
                                        As of {moment(db_alert_data.data_ts).format("MMMM D, YYYY h:mm A")}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} align="center">
                                    <Typography variant="h5" className={[classes.label_paddings]}>
                                        valid until
                                    </Typography>
                                    <Typography variant="h5" className={[classes.label_paddings]}>
                                        {moment(db_alert_data.validity).format("MMMM D, YYYY h:mm A")}
                                    </Typography>
                                </Grid>
                            </Fragment>
                        )
                    }
                    {
                        triggers.length > 0 ? 
                            triggers.map(row => {
                                const lookup = {
                                    rainfall: "Latest Rainfall Data",
                                    moms: "Latest Manifestations of Movements (MOMs) report",
                                    subsurface: "Latest Sensor Data",
                                    surficial: "Latest Ground Measurement Data",
                                    on_demand: "Latest On Demand Alert Data",
                                    earthquake: "Latest Earthquake Data"
                                }

                                return (
                                    <Grid item xs={6} align="center">
                                        <Box className={classes.info_padding}>
                                            <Typography variant="h5" >
                                                {lookup[row.trigger_source]}
                                            </Typography>
                                            <Typography variant="h6">
                                                {row.info}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                );
                            })
                        : (
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