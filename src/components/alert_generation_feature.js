import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TransitionalModal from '../reducers/loading';
import {
    Container, Grid, Fab, Typography,
    Table, TableBody, TableCell, TableHead,
    TableRow, Paper, Box
} from '@material-ui/core';

import RainfallPlot from './rainfall_plot';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    margin: {
        margin: theme.spacing(1),
    },
    menu_functions: {
        paddingTop: '10%'
    },
    button_fluid: {
        width: '90%',
        padding: 10
    },
    label_paddings: {
        padding: 10
    },
    alert_level: {
        color: '#f09e01'
    }
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

function AlertValidation() {

    function createData(date_time, trigger, data_source, description) {
        return { date_time, trigger, data_source, description };
    }

    function validateAlert(status) {
        if (status === true) {
            alert("Alert valid!")
        } else {
            alert("Alert invalid!")
        }
    }

    const rows = [
        createData('2019-10-06 04:00:00', 'Rainfall', 'RAIN_UMIG', 'Exceeded threshold level'),
        createData('2019-10-06 04:00:00', 'MoMs', 'Crack C', 'New crack near Crack C'),
    ];

    const dt_classes = tableStyle();
    const classes = useStyles();

    return (
        <Fragment>
            <Container fixed>
                <Grid container align="center" spacing={10}>
                    <Grid item xs={12}>
                        <Typography variant="h2" className={[classes.label_paddings, classes.alert_level]}>
                            Alert 2
                        </Typography>
                        <Typography variant="h5">
                            As of October 6, 2019 04:00 AM
                        </Typography>
                        <Typography variant="h5" className={classes.label_paddings}>
                            Rainfall Trigger: RAIN_MARG 1-day cumulative rainfall (100.00 mm) exceeded threshold (56.55mm)
                        </Typography>
                        <Typography variant="h5" className={classes.label_paddings}>
                            Manifestation of Movements Trigger: New Crack near Crack C
                        </Typography>
                        <Typography variant="h5" className={classes.label_paddings}>
                            Event Start: October 5, 2019 12:00 PM
                        </Typography>
                        <Typography variant="h5" className={classes.label_paddings}>
                            Validity: October 7, 2019 12:00 PM
                        </Typography>
                        <Typography variant="h5" className={classes.label_paddings}>
                            Recommended Response: Prepare for evacuation
                        </Typography>
                    </Grid>
                    <Grid item xs={3} />

                    <Grid item xs={3}>
                        <Fab variant="extended"
                            color="primary"
                            aria-label="add" className={classes.button_fluid}
                            onClick={() => { validateAlert(true) }}>
                            Valid
                        </Fab>
                    </Grid>
                    <Grid item xs={3}>
                        <Fab variant="extended"
                            color="primary"
                            aria-label="add" className={classes.button_fluid}
                            onClick={() => { validateAlert(false) }}>
                            Invalid
                        </Fab>
                    </Grid>
                    <Grid item xs={3} />
                    <Grid item xs={12}>
                        <Paper className={dt_classes.root}>
                            <Table className={dt_classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date and time of trigger</TableCell>
                                        <TableCell>Trigger</TableCell>
                                        <TableCell>Data Source</TableCell>
                                        <TableCell>Description</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map(row => (
                                        <TableRow key={row.date_time}>
                                            <TableCell component="th" scope="row">
                                                {row.date_time}
                                            </TableCell>
                                            <TableCell>{row.trigger}</TableCell>
                                            <TableCell>{row.data_source}</TableCell>
                                            <TableCell>{row.description}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <RainfallPlot feature={"alert_validation"} />
                    </Grid>
                </Grid>
            </Container>
        </Fragment>
    );
}

function LatestCurrentAlert() {
    const classes = useStyles();
    const [modal, setModal] = useState([<TransitionalModal status={false} />])

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
                    <Grid item xs={6} align="center">
                        <Typography variant="h2" className={[classes.label_paddings, classes.alert_level]}>
                            Alert 2
                        </Typography>
                        <Typography variant="h5">
                            As of October 6, 2019 04:00 AM
                        </Typography>
                        <Typography variant="h5">
                            No new retriggers
                        </Typography>
                        <Typography variant="h5" className={classes.label_paddings}>
                            Event Start: October 5, 2019 12:00 PM
                        </Typography>
                        <Typography variant="h5" className={classes.label_paddings}>
                            Validity: October 7, 2019 12:00 PM
                        </Typography>
                        <Typography variant="h5" className={classes.label_paddings}>
                            Recommended Response: Prepare for evacuation
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h2" align="center" className={classes.label_paddings}>
                            Triggers
                        </Typography>
                        <Typography variant="h5" className={classes.label_paddings}>
                            Rainfall Trigger: RAIN_MARG 1-day cumulative rainfall (100.00 mm) exceeded threshold (56.55mm)
                        </Typography>
                        <Typography variant="h5" className={classes.label_paddings}>
                            Manifestation of Movements Trigger: New Crack near Crack C
                        </Typography>
                    </Grid>
                    <Grid item xs={12} align="right">
                        <Box style={{paddingTop: 100}}>
                            Prepared by: Carlo bontia, Tine Dumagan
                        </Box>
                    </Grid>
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