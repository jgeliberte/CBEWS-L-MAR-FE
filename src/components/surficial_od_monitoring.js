import React, {Fragment, useEffect, useState} from 'react';
import {
    Grid, Paper, Container,
    Fab, makeStyles, Table,
    TableBody, TableCell, TableHead,
    TableRow, Box, TextField, Button,
    FormControl, InputLabel, Select, MenuItem
} from "@material-ui/core";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from "moment";
import AppConfig from '../reducers/AppConfig';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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

const useStyles = makeStyles(theme => ({
    button_fluid: {
        width: '90%',
        padding: 10
    },
}));

const default_vars = {
    "alert_level": 1,
    "reason": "",
    "reporter": "",
    "site_id": AppConfig.CONFIG.site_id,
    "ts": moment().format("YYYY-MM-DD hh:mm:ss")
}

function ODMonitoring() {
    const dt_classes = tableStyle();
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const [rows, setRows] = useState([]);
    const [openRaise, setOpenRaise] = React.useState(false);
    const [od_input, setODInput] = useState(default_vars);

    const [openNotif, setOpenNotif] = useState(false);
    const [notifText, setNotifText] = useState("");
    const [notifStatus, setNotifStatus] = useState('success');

    useEffect(() => {
        fetchODData();
    }, []);

    function fetchODData() {
        console.log("FETCHING");
        fetch(`${AppConfig.HOSTNAME}/api/ground_data/on_demand/fetch/${AppConfig.CONFIG.site_id}`, {
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
                setRows(response.data);
            }
        }).catch(error => {
            console.error(error);
            setNotifStatus("error");
            setNotifText("Failure on fetching on demand data");
            setOpenNotif(true);
        });
    }

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const handleClickOpenRaise = row => () => {
      setODInput(row);
      setOpenRaise(true);
    };
  
    const handleCloseRaise = () => {
      setOpenRaise(false);
    };

    const handleChangeValue = key => event => {
        const { value } = event.target;
        setODInput({
            ...od_input,
            [key]: value
        });
    };

    const dateHandler = data => {
        setODInput({
            ...od_input,
            ts: moment(data).format("YYYY-MM-DD hh:mm:ss")
        });
    };

    const handleSubmit = () => {
        fetch(`${AppConfig.HOSTNAME}/api/ground_data/on_demand/add`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(od_input),
        }).then(response => response.json())
            .then(response => {
                const { message } = response;
                if (response.ok) {
                    console.log(response);
                    handleClose();
                    setODInput(default_vars);
                    setNotifStatus("success");
                    setNotifText("Successfully added on demand data");
                    setOpenNotif(true);
                    fetchODData();
                }
            })
            .catch(error => {
                setNotifStatus("error");
                setNotifText("Error in adding on demand data. Please contact the developers.");
                setOpenNotif(true);
                console.error(error);
            });
    }

    const handleRaise = () => {
        console.log("raise_input", od_input);
        fetch(`${AppConfig.HOSTNAME}/api/ground_data/on_demand/raise`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "site_id": AppConfig.CONFIG.site_id,
                "timestamp": od_input.ts
            }),
        }).then(response => response.json())
            .then(response => {
                const { message } = response;
                if (response.ok) {
                    console.log(response);
                    handleClose();
                    setNotifStatus("success");
                    setNotifText("Successfully raised on demand data");
                    setOpenNotif(true);
                    setODInput(default_vars);
                }
            })
            .catch(error => {
                setODInput(default_vars);
                setNotifStatus("error");
                setNotifText("Error in raising on demand data. Please contact the developers.");
                setOpenNotif(true);
                console.error(error);
            })
            .finally(() => setOpenRaise(false));
    }

    return (
        <Fragment>
        <Container fixed>
            <Grid container align="center" spacing={2}>
                <Grid item xs={12}>
                    <Paper className={dt_classes.root}>
                        <Table className={dt_classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date and time</TableCell>
                                    <TableCell>Reporter</TableCell>
                                    <TableCell>Reason for Monitoring</TableCell>
                                    <TableCell>Alert Level</TableCell>
                                    {/* <TableCell>Attachments</TableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map(row => (
                                    <TableRow key={row.ts} onClick={handleClickOpenRaise(row)}>
                                        <TableCell component="th" scope="row">
                                            {row.ts}
                                        </TableCell>
                                        <TableCell>{row.reporter}</TableCell>
                                        <TableCell>{row.reason}</TableCell>
                                        <TableCell>{row.alert_level}</TableCell>
                                        {/* <TableCell>{row.attachments}</TableCell> */}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Box>
                        * click row to raise on demand.
                    </Box>
                </Grid>
                <Grid container align="center" style={{ paddingTop: 20 }}>
                    <Grid item xs={2} />
                    <Grid item xs={3}>
                        <Fab variant="extended"
                            color="primary"
                            aria-label="add" className={classes.button_fluid}
                            onClick={handleClickOpen}>
                            Add on-demand monitoring
                        </Fab>
                    </Grid>
                    <Grid item xs={3}>
                        <Fab variant="extended"
                            color="primary"
                            aria-label="add" className={classes.button_fluid}
                            onClick={() => {}}>
                            Download
                        </Fab>
                    </Grid>
                    <Grid item xs={3}>
                        <Fab variant="extended"
                            color="primary"
                            aria-label="add" className={classes.button_fluid}
                            onClick={() => {}}>
                            Print
                        </Fab>
                    </Grid>
                    <Grid item xs={2} />
                </Grid>
            </Grid>
        </Container>

        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Capacity and Vulnerability</DialogTitle>
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
                    value={od_input.ts}
                    onChange={dateHandler}
                />
            </MuiPickersUtilsProvider>
             <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Reporter"
                type="email"
                fullWidth
                value={od_input.reporter}
                onChange={handleChangeValue("reporter")}
            />
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Reason for monitoring"
                type="email"
                fullWidth
                value={od_input.reason}
                onChange={handleChangeValue("reason")}
            />
            <FormControl className={classes.formControl} fullWidth>
                <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                    Alert Level
                </InputLabel>
                <Select
                    labelId="demo-simple-select-placeholder-label-label"
                    id="demo-simple-select-placeholder-label"
                    value={od_input.alert_level}
                    onChange={handleChangeValue("alert_level")}
                >   
                    <MenuItem value={1}><em>Alert 1</em></MenuItem>
                    <MenuItem value={2}>Alert 2</MenuItem>
                    <MenuItem value={3}>Alert 3</MenuItem>
                </Select>
            </FormControl>
             {/* <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Attachment"
                type="email"
                fullWidth
                onChange={handleChangeValue("attachm")}
            /> */}
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



        <Dialog
            open={openRaise}
            onClose={handleCloseRaise}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Raise On-demand monitoring?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to raise this alert?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseRaise} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleRaise} color="primary" autoFocus>
                    Confirm
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

export default ODMonitoring