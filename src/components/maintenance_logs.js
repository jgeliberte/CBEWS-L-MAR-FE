import React, { Fragment, useEffect, useState } from 'react';
import {
    Container, Grid, Fab, Paper, Table,
    TableBody, TableCell, TableHead, TableRow, TextField,
    Button, Typography, Input
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
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

import AttachmentsGridList from '../reducers/attachment_list';
import PDFPreviewer from '../reducers/pdf_previewer'
import AppConfig from "../reducers/AppConfig";
import { renderToString } from 'react-dom/server';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
    maintenance_ts: moment().format("YYYY-MM-DD hh:mm:ss"),
    maintenance_type: "",
    remarks: "",
    in_charge: "",
    updater: "",
    site_id: AppConfig.CONFIG.site_id
};


function MaintenanceLogs() {
    const img = imageStyle();
    const summary = summaryStyle();
    const classes = generalStyle();

    const [range_start, setRangeStart] = useState("");
    const [range_end, setRangeEnd] = useState("");
    const [rows, setRows] = useState([]);
    const [events, setEvents] = useState([]);
    const [dialog_vars, setDialogVars] = useState(defaultVars);
    const [toUpdate, setToUpdate] = useState(false);
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [uploadOpen, setUploadOpen] = useState(false);

    const [file_to_upload, setFileToUpload] = useState(null);
    const [filename, setFilename] = useState("");
    const [log_attachments, setLogAttachments] = useState([]);

    const [notifStatus, setNotifStatus] = useState('success');
	const [openNotif, setOpenNotif] = useState(false);
    const [notifText, setNotifText] = useState('');
    
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
        }).catch(error => console.error(error));
    }

    function getMaintenanceLogsPerMonth(start, end) {
        setRangeStart(start);
        setRangeEnd(end);
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
                getMaintenanceLogsPerMonth(range_start, range_end);
                getMaintenanceLogsPerDay(payload.maintenance_ts)
                handleClose();
                setOpenNotif(true);
                setNotifStatus("success");
                setNotifText("Successfully added new maintenance logs.");
            } else {
                setOpenNotif(true);
                setNotifStatus("error");
                setNotifText("Failed to add maintenance logs. Please check your network connectivity.");
            }
        }).catch(error => console.error(error));
    }

    function updateMaintenanceLog(temp_payload) {
        const payload = {
            ...temp_payload,
            site_id: AppConfig.CONFIG.site_id
        }
        fetch(`${AppConfig.HOSTNAME}/api/maintenance/maintenance_logs/update`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        }).then(response => response.json()
        ).then(response => {
            if (response.ok) {
                getMaintenanceLogsPerMonth(range_start, range_end);
                getMaintenanceLogsPerDay(temp_payload.maintenance_ts);
                handleClose();
                setOpenNotif(true);
                setNotifStatus("success");
                setNotifText("Successfully updated maintenance logs.");
            }
            else {
                setOpenNotif(true);
                setNotifStatus("error");
                setNotifText("Failed to update maintenance logs. Please check your network connectivity.");
            }
        }).catch(error => console.error(error));
    }

    function deleteMaintenanceLog(payload) {
        const site_id = AppConfig.CONFIG.site_id;
        fetch(`${AppConfig.HOSTNAME}/api/maintenance/maintenance_logs/remove/${site_id}/${payload.maintenance_log_id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json()
        ).then(response => {
            if (response.ok) {
                getMaintenanceLogsPerMonth(range_start, range_end);
                getMaintenanceLogsPerDay(payload.maintenance_ts);
                handleConfirmClose();
                setOpenNotif(true);
                setNotifStatus("success");
                setNotifText("Successfully deleted maintenance logs.");
            }
            else {
                setOpenNotif(true);
                setNotifStatus("error");
                setNotifText("Failed to delete maintenance logs. Please check your network connectivity.");
            }
        }).catch(error => console.error(error));
    }

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
        setUploadOpen(false);
    };

    const dateClickHandler = args => {
        getMaintenanceLogsPerDay(args.date);
    };

    const calendarRenderHandler = args => {
        const { dates } = args.view.dayTable.daySeries;
        const length = dates.length
        getMaintenanceLogsPerMonth(dates[0], dates[length - 1]);
    };

    const handleSubmit = () => {
        const payload = dialog_vars;
        if (toUpdate) updateMaintenanceLog(payload);
        else addMaintenanceLog(payload);
    };

    const handleDelete = () => {
        const payload = dialog_vars;
        deleteMaintenanceLog(payload);
    };

    const dateHandler = data => {
        setDialogVars({
            ...dialog_vars,
            maintenance_ts: moment(data).format("YYYY-MM-DD hh:mm:ss")
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

    const handleClickUpload = maintenance_log_id => () => {
        const data = new FormData();
        data.append("file", file_to_upload);
        data.append("maintenance_log_id", maintenance_log_id);

        fetch(`${AppConfig.HOSTNAME}/api/maintenance/maintenance_logs/upload_log_attachment`, {
            method: 'POST',
            body: data,
        }).then(response => response.json())
            .then(response => {
                const { message } = response;
                if (response.ok) {
                    handleUploadClose();
                    setFileToUpload(null);
                    setFilename("");                
                    setOpenNotif(true);
                    setNotifStatus("success");
                    setNotifText("Successfully uploaded maintenance log file.");
                } else {        
                    setOpenNotif(true);
                    setNotifStatus("error");
                    setNotifText("Failed to upload maintenance log file. Please check your network connectivity.");
                }
            })
            .catch(error => console.error(error));
    };

    const rowClickHandler = (key, data) => () => {
        setToUpdate(true);
        setDialogVars(data);
        if (key === "edit") {
            fetch(`${AppConfig.HOSTNAME}/api/maintenance/maintenance_logs/fetch_log_attachments/${data.maintenance_log_id}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(response => response.json()
            ).then(response => {
                const { message } = response;
                if (response.ok) {
                    console.log("response", response);
                    setLogAttachments(response.data);
                    setOpen(true);
                }
            }).catch(error => console.error(error));
        }
        else setConfirmOpen(true);
    };

    const handleDownload = () => {
        const html = renderToString(<PDFPreviewer data={rows} dataType="logs" noImport={true} />);
        console.log("HTML", html)
        fetch(`${AppConfig.HOSTNAME}/api/reports/send_email`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                html,
                filename: "maintenance_report",
                date: moment().format("YYYY-MM-DD hh:mm:ss"),
                subject: "Maintenance Report",
                email: "jlouienepomuceno@gmail.com"
            }),
        }).then(response => response.json())
            .then(response => {
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
                            <PDFPreviewer
                                data={rows}
                                dataType="log"
                                noImport={false} 
                            // data={(
                            //     <LogTable
                            //         rows={rows}
                            //         rowClickHandler={rowClickHandler}
                            //     />
                            // )}
                            />
                            <Grid item xs={12}>
                                <Grid container align="center" style={{ paddingTop: 20 }}>
                                    <Grid item xs={3} />
                                    <Grid item xs={3}>
                                        <Fab variant="extended"
                                            color="primary"
                                            aria-label="add" className={classes.button_fluid}
                                            onClick={handleDownload}>
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
                        <LogTable
                            rows={rows}
                            rowClickHandler={rowClickHandler}
                        />
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
                    <MuiPickersUtilsProvider utils={MomentUtils}>
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
                            value={dialog_vars.maintenance_ts}
                            onChange={dateHandler}
                        />
                    </MuiPickersUtilsProvider>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="maintenance_type"
                        label="Type of maintenance"
                        type="email"
                        fullWidth
                        value={dialog_vars.maintenance_type}
                        onChange={changeHandler("maintenance_type")}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="remarks"
                        label="Remarks"
                        type="email"
                        fullWidth
                        value={dialog_vars.remarks}
                        onChange={changeHandler("remarks")}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="in_charge"
                        label="In-charge"
                        type="email"
                        fullWidth
                        value={dialog_vars.in_charge}
                        onChange={changeHandler("in_charge")}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="updater"
                        label="Updater"
                        type="email"
                        fullWidth
                        value={dialog_vars.updater}
                        onChange={changeHandler("updater")}
                    />
                    {
                        toUpdate ? (
                            <Container align="center">
                                <AttachmentsGridList
                                    data={log_attachments}
                                />
                                <Fab variant="extended"
                                    color={"primary"}
                                    aria-label="add"
                                    onClick={handleUploadOpen}>
                                    Upload Attachments
                                </Fab>
                            </Container>
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
                <DialogTitle id="form-dialog-title">Maintenance Log</DialogTitle>
                <DialogContent>
                    <Typography>Do you want to delete this log?</Typography>
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
                        onClick={handleClickUpload(dialog_vars.maintenance_log_id)}
                        color="primary">
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
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
    )
}

function LogTable(props) {
    const { rows, rowClickHandler } = props;
    const dt_classes = tableStyle();
    return (
        <Paper className={dt_classes.root}>
            {
                rows.length > 0 ? (
                    <Table className={dt_classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Actions</TableCell>
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
    );
}


export default MaintenanceLogs