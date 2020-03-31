import React, { Fragment, useEffect, useState } from 'react'
import {
    Container, Grid, Fab, Paper, Table,
    TableBody, TableCell, TableHead, TableRow, TextField,
    Button, Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction";
import '../../node_modules/@fullcalendar/core/main.css';
import '../../node_modules/@fullcalendar/daygrid/main.css';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from "moment";
import AppConfig from "../reducers/AppConfig";

const calendarRef = React.createRef();
const tsRef = React.createRef();
const typeRef = React.createRef();
const remarksRef = React.createRef();
const inChargeRef = React.createRef();
const updaterRef = React.createRef();


const imageStyle = makeStyles(theme => ({
    img_size: {
        height: '100%',
        width: '100%'
    },
    summary_content: {
        minHeight: 500
    }
}));

const summaryStyle = makeStyles(theme => ({
    content: {
        minHeight: getWindowDimensions().height * 0.415,
        maxHeight: getWindowDimensions().height * 0.415
    }
}));

const generalStyle = makeStyles(theme => ({
    button_fluid: {
        width: '90%',
        padding: 10
    },
}));

const tableStyle = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    },
}));

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}


function MaintenanceLogs() {
    const img = imageStyle();
    const summary = summaryStyle();
    const classes = generalStyle();
    const dt_classes = tableStyle();

    const [flag, setFlag] = useState(true);
    const [rows, setRows] = useState([]);
    const [events, setEvents] = useState([]);
    // const [dialog_vars, setDialogVars] = useState({
    //     maintenance_ts: "",
    //     maintenance_type: "",
    //     remarks: "",
    //     in_charge: "",
    //     updater: ""
    // });
    const [ts_input, setTSInput] = useState(moment());

    useState(() => {
        console.log("cause rerender");
    }, [flag]);

    function getMaintenanceLogsPerDay(day) {
        fetch(`${AppConfig.HOSTNAME}/api/maintenance/maintenance_logs/fetch`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "site_id": AppConfig.CONFIG.site_id,
                "ts_dict": {
                    "start": `${moment(day).format("YYYY-MM-DD")} 00:00:00`,
                    "end": `${moment(day).format("YYYY-MM-DD")} 23:59:00`
                }
            }),
        }).then(response => response.json()
        ).then(response => {
            if (response.ok) setRows(response.data);
            else console.error("Problem in getMaintenanceLogsPerDay backend");
        }).catch(error => console.error(error));
    }

    function getMaintenanceLogsPerMonth(start, end) {
        fetch(`${AppConfig.HOSTNAME}/api/maintenance/maintenance_logs/fetch`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "site_id": AppConfig.CONFIG.site_id,
                "ts_dict": {
                    "start": `${moment(start).format("YYYY-MM-DD")} 00:00:00`,
                    "end": `${moment(end).format("YYYY-MM-DD")} 23:59:00`
                }
            }),
        }).then(response => response.json()
        ).then(response => {
            if (response.ok) setEvents(response.data.map(row => ({
                "title": row.maintenance_type,
                "date": moment(row.maintenance_ts).format("YYYY-MM-DD")
            })));
            else console.error("Problem in getMaintenanceLogsPerMonth backend");
        }).catch(error => console.error(error));
    }

    function addMaintenanceLog(payload) {
        fetch(`${AppConfig.HOSTNAME}/api/maintenance/maintenance_logs/add`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        }).then(response => response.json()
        ).then(response => {
            if (response.ok) {
                setFlag(!flag);
                handleClose();
            }
            else console.error("Problem in addMaintenanceLog backend");
        }).catch(error => console.error(error));
    }

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const dateClickHandler = args => {
        console.log("args", args);
        getMaintenanceLogsPerDay(args.date);
    };

    const calendarRenderHandler = args => {
        console.log("args", args);
        const { dates } = args.view.dayTable.daySeries;
        const length = dates.length
        getMaintenanceLogsPerMonth(dates[0], dates[length - 1]);
    };

    const handleSubmit = () => {
        console.log("CLICKED SUBMIT!", tsRef);
        const payload = {
            "maintenance_ts": moment(ts_input).format("YYYY-MM-DD hh:mm:ss"),
            "maintenance_type": typeRef.current.children[0].control.value,
            "remarks": remarksRef.current.children[0].control.value,
            "in_charge": inChargeRef.current.children[0].control.value,
            "updater": updaterRef.current.children[0].control.value,
            "site_id": AppConfig.CONFIG.site_id
        };
        addMaintenanceLog(payload);
    };

    const dateHandler = data => {
        setTSInput(moment(data).format("YYYY-MM-DD hh:mm:ss"));
        console.log(data);
    }

    return (
        <Fragment>
            <Container align="center" justify="center">
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <FullCalendar
                            ref={calendarRef}
                            datesRender={calendarRenderHandler}
                            dateClick={dateClickHandler}
                            events={events}
                            defaultView="dayGridMonth"
                            plugins={[dayGridPlugin, interactionPlugin]}
                        />
                    </Grid>
                    <Grid item xs={6}>

                        <Grid container>
                            <Paper>
                                <Grid item xs={12}>
                                    <img src={require('../assets/letter_header.png')} className={img.img_size} alt="footer" />
                                </Grid>
                                <Grid item xs={12} className={summary.content}>
                                    Content
                                </Grid>
                                <Grid item xs={12}>
                                    <img src={require('../assets/letter_footer.png')} className={img.img_size} alt="footer" />
                                </Grid>
                            </Paper>
                            <Grid item xs={12}>
                                <Grid container align="center" style={{ paddingTop: 20 }}>
                                    <Grid item xs={3} />
                                    <Grid item xs={3}>
                                        <Fab variant="extended"
                                            color="primary"
                                            aria-label="add" className={classes.button_fluid}
                                            onClick={() => { }}>
                                            Download
                                            </Fab>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Fab variant="extended"
                                            color="primary"
                                            aria-label="add" className={classes.button_fluid}
                                            onClick={() => { }}>
                                            Print
                                            </Fab>
                                    </Grid>
                                    <Grid item xs={3} />
                                </Grid>
                            </Grid>
                        </Grid>

                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={dt_classes.root}>
                            {
                                rows.length > 0 ? (
                                    <Table className={dt_classes.table}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Date and time</TableCell>
                                                <TableCell>Type of maintenance</TableCell>
                                                <TableCell>Remarks</TableCell>
                                                <TableCell>In-charge</TableCell>
                                                <TableCell>Updater</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.map(row => (
                                                <TableRow key={row.date_time}>
                                                    <TableCell component="th" scope="row">
                                                        {row.maintenance_ts}
                                                    </TableCell>
                                                    <TableCell>{row.maintenance_type.charAt(0).toUpperCase() + row.maintenance_type.slice(1)}</TableCell>
                                                    <TableCell>{row.remarks}</TableCell>
                                                    <TableCell>{row.in_charge}</TableCell>
                                                    <TableCell>{row.updater}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                        <Typography>No maintenance happened on selected date.</Typography>
                                    )
                            }
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={4} />
                            <Grid item xs={4}>
                                <Fab variant="extended"
                                    color="primary"
                                    aria-label="add" className={classes.button_fluid}
                                    onClick={handleClickOpen}>
                                    Add Maintenance Report
                                </Fab>
                            </Grid>
                            <Grid item xs={4} />
                        </Grid>
                    </Grid>
                </Grid>
            </Container>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Maintenance Log</DialogTitle>
                <DialogContent>
                    <MuiPickersUtilsProvider ref={tsRef} utils={MomentUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM-DD-YYYY HH:mm:ss"
                            margin="normal"
                            id="maintenance_ts"
                            label="Date time"
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            fullWidth
                            value={ts_input}
                            onChange={dateHandler}
                        />
                    </MuiPickersUtilsProvider>
                    <TextField
                        ref={typeRef}
                        autoFocus
                        margin="dense"
                        id="maintenance_type"
                        label="Type of maintenance"
                        type="email"
                        fullWidth
                    />
                    <TextField
                        ref={remarksRef}
                        autoFocus
                        margin="dense"
                        id="remarks"
                        label="Remarks"
                        type="email"
                        fullWidth
                    />
                    <TextField
                        ref={inChargeRef}
                        autoFocus
                        margin="dense"
                        id="in_charge"
                        label="In-charge"
                        type="email"
                        fullWidth
                    />
                    <TextField
                        ref={updaterRef}
                        autoFocus
                        margin="dense"
                        id="updater"
                        label="Updater"
                        type="email"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
            </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Confirm
            </Button>
                </DialogActions>
            </Dialog>


        </Fragment>
    )
}

export default MaintenanceLogs