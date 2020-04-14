import React, {Fragment, useEffect, useState} from 'react';
import {
    Grid, Paper, Container,
    Fab, makeStyles, Table,
    TableBody, TableCell, TableHead,
    TableRow, Box, TextField, Button
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
    "is_lgu": 0,
    "reason": "",
    "reporter": "",
    "site_id": 29,
    "ts": moment().format("YYYY-MM-DD hh:mm:ss")
}

function ODMonitoring() {
    const dt_classes = tableStyle();
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const [rows, setRows] = useState([]);
    const [openRaise, setOpenRaise] = React.useState(false);
    const [od_input, setODInput] = useState(default_vars);

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
        }).catch(error => console.error(error));
    }

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

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };


    const handleClickOpenRaise = () => {
      setOpenRaise(true);
    };
  
    const handleCloseRaise = () => {
      setOpenRaise(false);
    };

    const handleSubmit = () => {
        fetch(`${AppConfig.HOSTNAME}/api/ground_data/on_demand/add`, {
            method: 'POST',
            body: od_input,
        }).then(response => response.json())
            .then(response => {
                const { message } = response;
                if (response.ok) {
                    console.log(response);
                    handleClose();
                    setODInput(default_vars);
                }
                alert(message);
            })
            .catch(error => console.error(error));
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
                                    {/* <TableCell>Attachments</TableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map(row => (
                                    <TableRow key={row.ts} onClick={handleClickOpenRaise}>
                                        <TableCell component="th" scope="row">
                                            {row.ts}
                                        </TableCell>
                                        <TableCell>{row.is_llmc}</TableCell>
                                        <TableCell>{row.reason}</TableCell>
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
                    <Button onClick={handleCloseRaise} color="primary" autoFocus>
                        Confirm
            </Button>
                </DialogActions>
            </Dialog>


    </Fragment>
    )
}

export default ODMonitoring