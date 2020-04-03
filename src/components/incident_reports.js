import React, { Fragment, useState } from 'react'
import CustomGridList from '../reducers/grid_list'
import {
    Container, Grid, Fab, Paper, Table, Typography,
    TableBody, TableCell, TableHead, TableRow, TextField,
    Button, Input
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core/styles';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
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

const defaultVars = {
    report_ts: moment().format("YYYY-MM-DD hh:mm:ss"),
    description: "",
    reporter: "",
    // attachment: "",
    site_id: AppConfig.CONFIG.site_id
};

function IncidentReports() {
    const img = imageStyle();
    const summary = summaryStyle();
    const classes = generalStyle();
    const dt_classes = tableStyle();

    const [flag, setFlag] = useState(true);
    const [range_start, setRangeStart] = useState("");
    const [range_end, setRangeEnd] = useState("");
    const [rows, setRows] = useState([]);
    const [events, setEvents] = useState([]);
    const [dialog_vars, setDialogVars] = useState(defaultVars);
    const [toUpdate, setToUpdate] = useState(false);
    const [uploadOpen, setUploadOpen] = useState(false);

    const [file_to_upload, setFileToUpload] = useState(null);
    const [filename, setFilename] = useState("");

    function getIncidentReportsPerDay(day) {
        fetch(`${AppConfig.HOSTNAME}/api/maintenance/incident_reports/fetch`, {
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
        }).catch(error => console.error(error));
    }

    function getIncidentReportsPerMonth(start, end) {
        setRangeStart(start);
        setRangeEnd(end);
        fetch(`${AppConfig.HOSTNAME}/api/maintenance/incident_reports/fetch`, {
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
                "title": row.reporter,
                "date": moment(row.report_ts).format("YYYY-MM-DD")
            })));
            else console.error("Problem in getIncidentReportsPerMonth backend");
        }).catch(error => console.error(error));
    }

    function addIncidentReport(payload) {
        const data = new FormData();
        data.append("file", "");
        data.append("report_ts", payload.report_ts);
        console.log("formdata", data);
        
        fetch(`${AppConfig.HOSTNAME}/api/maintenance/incident_reports/add`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        }).then(response => response.json()
        ).then(response => {
            if (response.ok) {
                getIncidentReportsPerMonth(range_start, range_end);
                getIncidentReportsPerDay(payload.report_ts)
                handleClose();
            }
            else console.error("Problem in addIncidentReport backend");
            alert(response.message);
        }).catch(error => console.error(error));
    }

    function updateIncidentReport(temp_payload) {
        const payload = {
            ...temp_payload,
            site_id: AppConfig.CONFIG.site_id
        }
        fetch(`${AppConfig.HOSTNAME}/api/maintenance/incident_reports/update`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        }).then(response => response.json()
        ).then(response => {
            if (response.ok) {
                getIncidentReportsPerMonth(range_start, range_end);
                getIncidentReportsPerDay(temp_payload.report_ts);
                handleClose();
            }
            else console.error("Problem in updateIncidentReport backend");
            alert(response.message);
        }).catch(error => console.error(error));
    }

    function deleteIncidentReport(payload) {
        const site_id = AppConfig.CONFIG.site_id;
        fetch(`${AppConfig.HOSTNAME}/api/maintenance/incident_reports/remove/${site_id}/${payload.ir_id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json()
        ).then(response => {
            if (response.ok) {
                getIncidentReportsPerMonth(range_start, range_end);
                getIncidentReportsPerDay(payload.report_ts);
                handleConfirmClose();
            }
            else console.error("Problem in deleteIncidentReport backend");
            alert(response.message);
        }).catch(error => console.error(error));
    }
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleClickOpen = () => {
        setDialogVars(defaultVars);
        setToUpdate(false);
        setOpen(true);
    };

    const handleClose = () => {
        setDialogVars(defaultVars);
        setToUpdate(false);
        setOpen(false);
    };

    const handleConfirmClose = () => {
        setDialogVars(defaultVars);
        setConfirmOpen(false);
        setToUpdate(false);
    };

    const handleUploadOpen = () => {
        setUploadOpen(true);
    };

    const handleUploadClose = () => {
        setFileToUpload(null);
        setFilename("");
        setUploadOpen(false);
    };

    const dateClickHandler = args => {
        getIncidentReportsPerDay(args.date);
    };

    const calendarRenderHandler = args => {
        const { dates } = args.view.dayTable.daySeries;
        const length = dates.length
        getIncidentReportsPerMonth(dates[0], dates[length - 1]);
    };

    const handleSubmit = () => {
        const payload = dialog_vars;
        if (toUpdate) updateIncidentReport(payload);
        else addIncidentReport(payload);
    };

    const handleDelete = () => {
        const payload = dialog_vars;
        deleteIncidentReport(payload);
    };

    const dateHandler = data => {
        setDialogVars({
            ...dialog_vars,
            report_ts: moment(data).format("YYYY-MM-DD hh:mm:ss")
        });
    };

    const changeHandler = key => event => {
        const { value } = event.target;
        setDialogVars({
            ...dialog_vars,
            [key]: value
        });
    };

    const handleFileSelection = event => {
        const file = event.target.files[0];
        setFileToUpload(file);
        setFilename(file.name);
    };

    const handleClickUpload = ir_id => () => {
        const data = new FormData();
        data.append("file", file_to_upload);
        data.append("ir_id", ir_id);

        fetch(`${AppConfig.HOSTNAME}/api/maintenance/incident_reports/upload_report_attachment`, {
            method: 'POST',
            body: data,
        }).then(response => response.json())
        .then((response) => {
            const { message } = response;
            if (response.ok) {
                handleUploadClose();
                setFileToUpload(null);
                setFilename("");
            }
            alert(message);
        })
        .catch(error => console.error(error));
    };

    const rowClickHandler = (key, data) => () => {
        setToUpdate(true);
        setDialogVars(data);
        if (key === "edit") setOpen(true);
        else setConfirmOpen(true);
    };

    return (
        <Fragment>
            <Container align="center" justify="center">
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <FullCalendar
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
                            <Table className={dt_classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Actions</TableCell>
                                        <TableCell>Date and time</TableCell>
                                        <TableCell>Incident Desc / Narrative</TableCell>
                                        <TableCell>Reporter</TableCell>
                                        {/* <TableCell>Has Attachments</TableCell> */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map(row => (
                                        <TableRow key={row.report_ts}>
                                            <TableCell>
                                                <Button onClick={rowClickHandler("edit", row)} color="primary">
                                                    {/* Edit */}
                                                    <EditIcon />
                                                </Button>
                                                <Button onClick={rowClickHandler("delete", row)} color="primary">
                                                    {/* Delete */}
                                                    <DeleteIcon />
                                                </Button>
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {row.report_ts}
                                            </TableCell>
                                            <TableCell>{row.description}</TableCell>
                                            <TableCell>{row.reporter}</TableCell>
                                            {/* <TableCell>{[]}</TableCell> */}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
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
                                    Add Incident report
                                </Fab>
                            </Grid>
                            <Grid item xs={4} />
                        </Grid>
                    </Grid>
                </Grid>
            </Container>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Incident Report</DialogTitle>
                <DialogContent>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM-DD-YYYY HH:mm:ss"
                            margin="normal"
                            id="date-picker-start"
                            label="Date time"
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            fullWidth
                            value={dialog_vars.report_ts}
                            onChange={dateHandler}
                        />
                    </MuiPickersUtilsProvider>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="description"
                        label="Incident Description / Narrative"
                        type="email"
                        fullWidth
                        value={dialog_vars.description}
                        onChange={changeHandler("description")}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="reporter"
                        label="Reporter"
                        type="email"
                        fullWidth
                        value={dialog_vars.reporter}
                        onChange={changeHandler("reporter")}
                    />
                    {
                        toUpdate ? (
                            <Fragment>
                                <CustomGridList 
                                    data={[]}
                                    type="cra_list"
                                    // handleDownload={Helpers.downloadBlob}
                                    handleDownload={handleDelete}
                                    handleDelete={handleDelete}
                                />
                                <Fab variant="extended"
                                    color={"primary"}
                                    aria-label="add"
                                    onClick={handleUploadOpen}>
                                    Upload Attachments
                                </Fab>  
                            </Fragment>
                        ) : (
                            <Typography>You can attach files after saving the log.</Typography>
                        )
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        {
                            toUpdate ? "Update Log" : "Add Log"
                        }
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={handleConfirmClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Incident Report</DialogTitle>
                <DialogContent>
                    <Typography>Do you want to delete this report?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="primary">
                        Confirm Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={uploadOpen} onClose={handleUploadClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">File upload</DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={8}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="File path"
                                type="email"
                                fullWidth
                                value={filename}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Input
                                name="file"
                                type="file"
                                onChange={handleFileSelection}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUploadClose} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleClickUpload(dialog_vars.ir_id)}
                        color="primary">
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>


        </Fragment>
    )
}

export default IncidentReports