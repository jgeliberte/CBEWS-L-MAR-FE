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

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function AlertValidation() {
    const [public_alert, setPublicAlert] = useState("Loading...");
    const [candidate_status, setCandidateStatus] = useState("no_alert");
    const [validity, setValidity] = useState("");
    const [data_ts, setDataTs] = useState("");
    const [as_of_ts, setAsOfTs] = useState("");
    const [ewi_data, setEwiData] = useState({});
    const [is_release_time, setIsReleaseTime] = useState(false);
    const [rows, setRow] = useState([]);
    const [all_validated, setAllValidated] = useState(false);

    const [openNotif, setOpenNotif] = useState(false);
    const [notifText, setNotifText] = useState("");
    const [notifStatus, setNotifStatus] = useState('success');


    useEffect(() => {
        // GET CANDIDATE TRIGGER
        updateAlertGen();
    }, []);
    
    const get_charts = (release_triggers) => {
        let return_data = [];
        if (release_triggers.length > 0) {
            const chart_list = release_triggers.map(trig => {
    
                const { trigger } = trig;
                let chart_load;
    
                if (trigger === "Rainfall") chart_load = (<Grid item xs={12}><RainfallPlot feature={"alert_validation"} /></Grid>)
                else if (trigger === "Subsurface") chart_load = (<Grid item xs={12}>subsurface</Grid>)
                else if (trigger === "Surficial") chart_load = (<Grid item xs={12}>surficial</Grid>)
                else if (trigger === "Moms") chart_load = (
                    <Grid item xs={12}>surficial</Grid>
                    )
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
    };

    const updateAlertGen = () => {
        fetch(`${AppConfig.HOSTNAME}/api/alert_gen/UI/get_mar_alert_validation_data`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json())
            .then(responseJson => {
                console.log("get_mar_alert_validation_data responseJson", responseJson);
                const { public_alert_level, as_of_ts, status } = responseJson.data;
                const as_of_ts_format = moment(as_of_ts).format("H:mm A, D MMMM YYYY, dddd");
                setAsOfTs(as_of_ts_format);
                setEwiData({
                    ...responseJson.data,
                    site_code: responseJson.data.site_code,
                    site_id: responseJson.data.site_id
                });
                let rel_trig = [];
                setCandidateStatus(status);
                if (["on-going", "new", "valid", "extended", "lowering"].includes(status)) {
                    const { validity: val, data_ts: dts, is_release_time: irt, release_triggers, all_validated: a_v } = responseJson.data;
                    const color = public_alert_level === 3 ? "red" : "#ee9d01";
                    setPublicAlert(
                        <Typography variant="h2" style={{"color": `${color}`}} className={[classes.label_paddings, classes.alert_level]}>
                            {`Alert ${public_alert_level}`}
                        </Typography>
                    );
                    setAsOfTs(as_of_ts_format);
                    setValidity(val !== null ? moment(val).format("MMMM D, YYYY h:mm A") : null);
                    setDataTs(moment(dts).format("MMMM D, YYYY h:mm A"));
                    setIsReleaseTime(irt);
                    setAllValidated(a_v);
                    rel_trig = release_triggers;
                } else if (status === "no_alert") {
                    setPublicAlert(
                        <Typography variant="h2" color="#28a745" className={[classes.label_paddings, classes.alert_level]}>
                            NO CANDIDATE AS OF NOW
                        </Typography>
                        )
                } else {
                    rel_trig = [];
                    setPublicAlert(
                        <Typography variant="h2" color="#28a745" className={[classes.label_paddings, classes.alert_level]}>
                            {`Alert ${public_alert_level}`}
                        </Typography>
                    );
                }

                return rel_trig;
            })
            .then(temp => get_charts(temp))
            .then(release_triggers => {
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
        if (status) {
            alert("Alert valid!");
            alert_validity = 1;
            remark = "valid trigger";
        } else {
            alert("Alert invalid!");
            alert_validity = -1;
            remark = "invalid trigger";
        }

        const payload = {
            trigger_id: data["trigger_id"],
            alert_status: alert_validity,
            remarks: remark,
            user_id: 1,
            ts_last_retrigger: data["date_time"]
        };

        fetch(`${AppConfig.HOSTNAME}/api/alert_gen/public_alerts/validate_trigger`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        }).then(response => response.json())
            .then(responseJson => {
                updateAlertGen();
            })
            .catch((error) => {
                console.error(error);
            }
            );
    }
    
    const releaseEwi = (payload) => {
        fetch(`${AppConfig.HOSTNAME}/api/alert_gen/public_alerts/insert_ewi`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        }).then(response => response.json())
            .then(responseJson => {
                setNotifText("Successfully released EWI");
                setOpenNotif(true);
                setNotifStatus("success");
                updateAlertGen();
            })
            .catch((error) => {
                console.error(error);
                setOpenNotif(true);
                setNotifStatus("error");
                setNotifText("Failed to release EWI. Please contact the developers or file a bug report");
            }
            );
    }
    const classes = useStyles();

    return (
        <Fragment>
            <Container fixed>
                <Grid container align="center" spacing={10}>
                    <Grid item xs={12} container spacing={5} >
                        <Grid item={12}><Typography variant="h3">ALERT VALIDATION</Typography></Grid>
                    </Grid>

                    {/* TRIGGER TABLE  */}
                    {rows.map(row => {
                        const { is_invalid } = row;

                        return (
                            <Fragment>
                                <Grid item xs={3}>
                                    <Typography variant="h6" align="left">Date Time of Alert: </Typography>
                                    <Typography variant="h5" align="left">{row.date_time}</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant="h6" align="left">Trigger: </Typography>
                                    <Typography variant="h5" align="left">{row.trigger}</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant="h6" align="left">Data Source:</Typography>
                                    <Typography variant="h5" align="left">{row.data_source}</Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <Typography variant="h6" align="left">Description:</Typography>
                                    <Typography variant="h5" align="left">{row.description}</Typography>
                                </Grid>

                                {row.chart}

                                <Grid item xs={3} />{/* PREV IS SPACER */}

                                <Grid item xs={3}>
                                    <Fab variant="extended"
                                        color={!is_invalid ? "secondary" : "primary"}
                                        aria-label="add" className={classes.button_fluid}
                                        onClick={() => { validateAlert(true, row) }}>
                                        Valid
                                    </Fab>
                                </Grid>
                                <Grid item xs={3}>
                                    <Fab variant="extended"
                                        color={is_invalid ? "secondary" : "primary"}
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
                        {public_alert}
                        <Typography variant="h5" className={[classes.label_paddings]}>
                            Status: {candidate_status.toUpperCase()}
                        </Typography>
                        {
                            validity !== null && (
                                <Fragment>
                                    <Typography variant="h5" className={[classes.label_paddings]}>
                                        Validity: {validity}
                                    </Typography>
                                </Fragment>
                            )
                        }
                    </Grid>

                    {
                        ["valid", "new", "on-going", "extended", "routine", "lowering"].includes(candidate_status) && (
                        // is_release_time && (
                            <Grid item xs={12}>
                                <Fab variant="extended"
                                    color="primary"
                                    aria-label="add" className={classes.button_fluid}
                                    onClick={() => releaseEwi(ewi_data)}
                                    disabled={!(all_validated && is_release_time)}
                                    >
                                    Release EWI
                                </Fab>
                            </Grid>
                        )
                    }

                </Grid>
            </Container>
            <Snackbar open={openNotif} 
                autoHideDuration={3000} 
                onClose={() => {setOpenNotif(false)}}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                key={'top,right'}>
                <Alert onClose={() => {setOpenNotif(false)}} severity={notifStatus}>
                    {notifText}
                </Alert>
            </Snackbar>
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