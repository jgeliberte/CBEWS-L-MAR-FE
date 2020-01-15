import React, { Fragment } from 'react'
import { Container, Grid, Fab, Paper, Table,
    TableBody, TableCell, TableHead, TableRow, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
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



function IncidentReports() {
    const img = imageStyle();
    const summary = summaryStyle();
    const classes = generalStyle();
    const dt_classes = tableStyle();

    function createData( date_time, incident_narrative, reporter, attachment ) {
        return { date_time, incident_narrative, reporter, attachment, reporter, attachment };
    }

    const rows = [
        createData('2019-10-06 04:20:00', 'Nasira ng mga bata ang kawad sa sensor', 'Carlo Bontia', 'NA'),
        createData('2019-10-06 04:00:00', 'Natangal ang pan salok ng sensor', 'Carlo Bontia', 'NA'),
        createData('2019-10-06 03:50:00', 'Nasira ang bakod', 'Carlo Bontia', 'NA'),
        createData('2019-10-06 03:30:00', 'Nawala ang battery', 'Carlo Bontia', 'NA'),
        createData('2019-10-06 03:20:00', 'Nabasa ng ulan ang loob ng data logger', 'Carlo Bontia', 'NA'),
    ];

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };


    return (
        <Fragment>
            <Container align="center" justify="center">
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <FullCalendar defaultView="dayGridMonth" plugins={[dayGridPlugin]} />
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
                                        <TableCell>Date and time</TableCell>
                                        <TableCell>Incident Desc / Narrative</TableCell>
                                        <TableCell>Reporter</TableCell>
                                        <TableCell>Attachment</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map(row => (
                                        <TableRow key={row.date_time}>
                                            <TableCell component="th" scope="row">
                                                {row.date_time}
                                            </TableCell>
                                            <TableCell>{row.incident_narrative}</TableCell>
                                            <TableCell>{row.reporter}</TableCell>
                                            <TableCell>{row.attachment}</TableCell>
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
                />
            </MuiPickersUtilsProvider>
             <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Incident Description / Narrative"
                type="email"
                fullWidth
            />
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


        </Fragment>
    )
}

export default IncidentReports