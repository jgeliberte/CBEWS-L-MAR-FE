import React, {Fragment} from 'react';
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
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

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

function ODMonitoring() {
    function createData(date_time, reporter, monitoring_reason, attachments) {
        return { date_time, reporter, monitoring_reason, attachments};
    }

    const rows = [
        createData('2019-08-08 07:30:00', 'John Geliberte', 'Malakas ang ulan', 'N/A'),
        createData('2019-08-02 11:30:00', 'John Geliberte', 'Malakas ang ulan', 'N/A'),
        createData('2019-07-29 11:30:00', 'John Geliberte', 'Lumindol ng mahina', 'N/A'),
        createData('2019-07-20 15:30:00', 'John Geliberte', 'Malakas ang ulan', 'N/A'),
        createData('2019-07-19 20:30:00', 'John Geliberte', 'Malakas ang ulan', 'N/A'),
        createData('2019-06-20 23:00:00', 'John Geliberte', 'May gumuhong lupa', 'N/A'),
        createData('2019-05-02 01:30:00', 'John Geliberte', 'Malakas ang ulan', 'N/A'),
        createData('2019-04-01 02:30:00', 'John Geliberte', 'Malakas ang ulan', 'N/A'),
        createData('2019-01-30 02:30:00', 'John Geliberte', 'Lumindol ng malakas', 'N/A')
    ];
    const dt_classes = tableStyle();
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const [openRaise, setOpenRaise] = React.useState(false);

    const handleClickOpenRaise = () => {
      setOpenRaise(true);
    };
  
    const handleCloseRaise = () => {
      setOpenRaise(false);
    };


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
                                    <TableCell>Attachments</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map(row => (
                                    <TableRow key={row.date_time} onClick={handleClickOpenRaise}>
                                        <TableCell component="th" scope="row">
                                            {row.date_time}
                                        </TableCell>
                                        <TableCell>{row.reporter}</TableCell>
                                        <TableCell>{row.monitoring_reason}</TableCell>
                                        <TableCell>{row.attachments}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Box>
                        * click row to raise moms.
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
                />
            </MuiPickersUtilsProvider>
             <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Reporter"
                type="email"
                fullWidth
            />
             <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Reason for monitoring"
                type="email"
                fullWidth
            />
             <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Attachment"
                type="email"
                fullWidth
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={handleClose} color="primary">
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