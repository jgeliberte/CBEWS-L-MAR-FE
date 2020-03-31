import React, { useState, Fragment, useEffect } from 'react';
import TransitionalModal from '../reducers/loading';
import {
    Container, Grid, Fab, Typography,
    Table, TableBody, TableCell, TableHead,
    TableRow, Paper, Box, Divider
} from '@material-ui/core';
import { useStyles, tableStyle } from '../styles/general_styles';
import AppConfig from "../reducers/AppConfig";
import Helper from "../Helpers";
import moment from "moment";

import RainfallPlot from './rainfall_plot';

function get_charts(release_triggers) {
    let return_data = [];
    if (release_triggers.length > 0) {
        console.log("MERON release_triggers", release_triggers);
        const chart_list = release_triggers.map(trig => {

            const { trigger } = trig;
            let chart_load;

            if (trigger === "Rainfall") chart_load = (<Grid item xs={12}><RainfallPlot feature={"alert_validation"} /></Grid>)
            else if (trigger === "Subsurface") chart_load = (<Grid item xs={12}>subsurface</Grid>)
            else if (trigger === "Surficial") chart_load = (<Grid item xs={12}>surficial</Grid>)
            else chart_load = null

            return {
                ...trig,
                chart: chart_load
            }
        });
        return_data = chart_list;
    } else {
        return_data = release_triggers;
    }

    return return_data;
}

function AlertValidation() {
    const [public_alert, setPublicAlert] = useState("Loading...");
    const [validity, setValidity] = useState("");
    const [data_ts, setDataTs] = useState("");
    const [as_of_ts, setAsOfTs] = useState("");
    const [is_release_time, setIsReleaseTime] = useState(false);
    const [rows, setRow] = useState([]);
    const [all_validated, setAllValidated] = useState(false);


    useEffect(() => {
        // GET CANDIDATE TRIGGER
        updateAlertGen();
    }, []);

    const updateAlertGen = () => {
        fetch(`${AppConfig.HOSTNAME}/api/alert_gen/UI/get_mar_alert_validation_data`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json())
            .then(responseJson => {
                console.log("responseJson", responseJson);
                const { public_alert_level, as_of_ts } = responseJson.data;
                const as_of_ts_format = moment(responseJson["as_of_ts"]).format("H:mm A, D MMMM YYYY, dddd");
                let rel_trig;
                if (public_alert_level > 0) {
                    const { validity: val, data_ts: dts, is_release_time: irt, release_triggers } = responseJson.data;
                    console.log("release_triggers", release_triggers)
                    setPublicAlert(`Alert ${public_alert_level}`);
                    setAsOfTs(as_of_ts_format);
                    setValidity(val);
                    setDataTs(dts);
                    setIsReleaseTime(irt);
                    return release_triggers;
                } else {
                    setPublicAlert(`Alert ${public_alert_level}`);
                    setAsOfTs(as_of_ts_format);
                    rel_trig = [];
                    return rel_trig;
                }
            })
            .then(temp => get_charts(temp))
            .then(release_triggers => {
                console.log("release_triggers", release_triggers);
                setRow(release_triggers);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const validateAlert = (status, data) => {
        // "#28a745"
        // "#ee9d01"

        // "#195770"
        let alert_validity = 0;
        let remark = "";
        if (status === true) {
            alert("Alert valid!");
            alert_validity = 1;
            remark = "valid trigger";
        } else {
            alert("Alert invalid!");
            alert_validity = -1;
            remark = "invalid trigger";
        }
        console.log("data", data);

        const payload = {
            trigger_id: data["trigger_id"],
            alert_status: alert_validity,
            remarks: remark,
            user_id: 1,
            ts_last_retrigger: data["date_time"]
        };
        console.log("payload", payload);

        fetch(`${AppConfig.HOSTNAME}/api/alert_gen/public_alerts/validate_trigger`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        }).then(response => response.json())
            .then(responseJson => {
                console.log("responseJson", responseJson);
                // updateAlertGen();
            })
            .catch((error) => {
                console.error(error);
            }
            );
    }

    const dt_classes = tableStyle();
    const classes = useStyles();

    return (
        <Fragment>
            <Container fixed>
                <Grid container align="center" spacing={10}>
                    <Grid item xs={12} container spacing={5} >
                        <Grid item={12}><Typography variant="h3">TRIGGER VALIDATION</Typography></Grid>
                    </Grid>

                    {/* TRIGGER TABLE  */}
                    {rows.map(row => {
                        console.log("ROW", row);

                        return (
                            <Fragment>
                                <Grid item xs={3}>
                                    <Typography variant="h7" align="left">Date Time of Alert: </Typography>
                                    <Typography variant="h6" align="left">{row.date_time}</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant="h7" align="left">Trigger: </Typography>
                                    <Typography variant="h6" align="left">{row.trigger}</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant="h7" align="left">Data Source:</Typography>
                                    <Typography variant="h6" align="left">{row.data_source}</Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <Typography variant="h7" align="left">Description:</Typography>
                                    <Typography variant="h6" align="left">{row.description}</Typography>
                                </Grid>

                                {row.chart}

                                <Grid item xs={3} />{/* PREV IS SPACER */}

                                <Grid item xs={3}>
                                    <Fab variant="extended"
                                        color="primary"
                                        aria-label="add" className={classes.button_fluid}
                                        onClick={() => { validateAlert(true, row) }}>
                                        Valid
                                    </Fab>
                                </Grid>
                                <Grid item xs={3}>
                                    <Fab variant="extended"
                                        color="primary"
                                        aria-label="add" className={classes.button_fluid}
                                        onClick={() => { validateAlert(false, row) }}>
                                        Invalid
                                    </Fab>
                                </Grid>

                                <Grid item xs={3} />{/* PREV IS SPACER */}
                                <Grid item xs={12}><Divider /></Grid>
                            </Fragment>
                        )
                    })}
                    <Grid item xs={12}>
                        <Typography variant="h5" className={[classes.label_paddings]}>
                            As of {as_of_ts}
                        </Typography>
                        <Typography variant="h2" className={[classes.label_paddings, classes.alert_level]}>
                            {public_alert}
                        </Typography>
                        {
                            public_alert !== "Alert 0" && (
                                <Fragment>
                                    <Typography variant="h5" className={[classes.label_paddings]}>
                                        Validity: {validity}
                                    </Typography>
                                    <Typography variant="h5" className={[classes.label_paddings]}>
                                        Data Timestamp: {data_ts}
                                    </Typography>
                                </Fragment>
                            )
                        }
                    </Grid>

                    {
                        public_alert !== "Alert 0" && (
                            <Grid item xs={12}>
                                <Fab variant="extended"
                                    color="primary"
                                    aria-label="add" className={classes.button_fluid}
                                    onClick={() => console.log("RELEASED")}
                                    disabled={!all_validated}
                                    >
                                    Release Alert
                                </Fab>
                            </Grid>
                        )
                    }

                </Grid>
            </Container>
        </Fragment>
    );
}


function CurrentAlertArea(props) {
    const { leo, classes } = props;

    const prepareTriggers = (triggers) => {
        if (triggers.length > 0) {
            return triggers.map(trigger => {
                const { trigger_type, timestamp, info, trigger_source } = trigger;
                return (
                    <Typography variant="h5" className={classes.label_paddings}>
                        {`${trigger_source.toUpperCase()} (${trigger_type}): ${info}`}
                    </Typography>
                );
            });
        } else {
            return (
                <Typography variant="h5" className={classes.label_paddings}>
                    No retriggers
                </Typography>
            )
        }

    };

    if (leo !== "empty") {
        console.log(leo);
        const as_of = moment(leo.data_ts).add(30, "mins").format("dddd, MMMM Do YYYY, h:mm A");
        const event_start = moment(leo.event_start).format("MMMM D, YYYY h:mm A");
        const validity = moment(leo.validity).format("MMMM D, YYYY h:mm A");
        return (
            <Fragment>
                <Grid item xs={6} align="center">
                    <Typography variant="h2" className={[classes.label_paddings, classes.alert_level]}>
                        {`Alert ${leo.public_alert_level}`}
                    </Typography>
                    <Typography variant="h5">
                        {`As of ${as_of}`}
                    </Typography>
                    <Typography variant="h5">
                        {prepareTriggers(leo.release_triggers)}
                    </Typography>
                    <Typography variant="h5" className={classes.label_paddings}>
                        {`Event Start: ${event_start}`}
                    </Typography>
                    <Typography variant="h5" className={classes.label_paddings}>
                        {`Validity: ${validity}`}
                    </Typography>
                    <Typography variant="h5" className={classes.label_paddings}>
                        {`Recommended Response: ${leo.recommended_response}`}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h2" align="center" className={classes.label_paddings}>
                        Triggers
                    </Typography>
                    {prepareTriggers(leo.latest_event_triggers)}
                </Grid>
                <Grid item xs={12} align="right">
                    <Box style={{ paddingTop: 100 }}>
                        Prepared by: {leo.reporter}
                    </Box>
                </Grid>
            </Fragment>
        );
    } else {
        return (
            <Typography variant="h2">No activity in site</Typography>
        )
    }
}

function LatestCurrentAlert() {
    const classes = useStyles();
    const [modal, setModal] = useState([<TransitionalModal status={false} />]);
    const [leo, setLeo] = useState("empty");
    const [releaseStatus, setReleaseStatus] = useState("No event on site.");

    useEffect(() => {
        console.log(`${AppConfig.HOSTNAME}/api/alert_gen/public_alerts/get_ongoing_and_extended_monitoring`);

        Helper.httpRequest(
            `${AppConfig.HOSTNAME}/api/alert_gen/public_alerts/get_ongoing_and_extended_monitoring`,
            "GET", [], null
        )
            .then(({ data, status }) => {
                let key = "";
                if (data.latest.length > 0) key = "latest";
                else if (data.overdue.length > 0) key = "overdue";
                else if (data.extended.length > 0) key = "extended";

                if (key in data) {
                    const site_data = data[key].find(site_data => site_data.site_id === 29);
                    setLeo(site_data);
                } else {
                    console.error("There is something wrong with the code in latest current alert");
                }
            })
            .catch(error => console.error(`Problem in getting active envets: Here's the error => ${error}`));

    }, []);

    function sendEmail() {
        setModal([<TransitionalModal status={true} />])
        setTimeout(() => {
            setModal([<TransitionalModal status={false} />])
            alert("Successfully sent email!")
        }, 3000)
    }

    function download() {
        setModal([<TransitionalModal status={true} />])
        setTimeout(() => {
            setModal([<TransitionalModal status={false} />])
            alert("Download success!")
        }, 3000)
    }

    function print() {
        setModal([<TransitionalModal status={true} />])
        setTimeout(() => {
            setModal([<TransitionalModal status={false} />])
            alert("Print success!")
        }, 3000)
    }

    return (
        <Fragment>
            <Container fixed>
                <Grid container spacing={2}>
                    <CurrentAlertArea leo={leo} classes={classes} />
                </Grid>
                <Grid container justify="center" className={classes.menu_functions}>
                    <Grid item xs={3}>

                    </Grid>
                    <Grid item xs={2} align="center" >
                        <Fab variant="extended"
                            color="primary"
                            aria-label="add" className={classes.button_fluid}
                            onClick={() => { sendEmail() }}>
                            Email
                        </Fab>
                    </Grid>
                    <Grid item xs={2} align="center">
                        <Fab variant="extended"
                            color="primary"
                            aria-label="add" className={classes.button_fluid}
                            onClick={() => { download() }}>
                            Download
                        </Fab>
                    </Grid>
                    <Grid item xs={2} align="center">
                        <Fab variant="extended"
                            color="primary"
                            aria-label="add" className={classes.button_fluid}
                            onClick={() => { print() }}>
                            Print
                        </Fab>
                    </Grid>
                    <Grid item xs={3}>

                    </Grid>
                </Grid>
            </Container>
            {modal}
        </Fragment>
    )
}

export { AlertValidation, LatestCurrentAlert }