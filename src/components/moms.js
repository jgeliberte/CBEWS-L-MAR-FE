import React, { Fragment, useEffect, useState } from 'react';
import {
    Grid, Paper, Container,
    Fab, makeStyles, Table,
    TableBody, TableCell, TableHead,
    TableRow, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, Button, Box, TextField, Typography
} from "@material-ui/core";

import {
    MuiPickersUtilsProvider,
    DateTimePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';

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

function MoMs() {
    function createData(date_time, feature, reporter, description) {
        return { date_time, feature, reporter, description };
    }

    const rows = [
        createData('2019-08-08 07:30:00', 'Crack', 'John Geliberte', 'May bagong Crack malapit sa Crack C'),
        createData('2019-08-07 07:30:00', 'Crack', 'John Geliberte', 'May bagong Crack malapit sa Crack A'),
        createData('2019-08-06 07:30:00', 'Seepage', 'John Geliberte', 'May nakitang seepage malapit sa municipyo'),
        createData('2019-08-05 07:30:00', 'Tilted/Ponding', 'John Geliberte', 'May baong ponding'),
        createData('2019-08-04 07:30:00', 'Tilted/Ponding', 'John Geliberte', 'May baong ponding'),
        createData('2019-08-03 07:30:00', 'Slope failure', 'John Geliberte', 'May baong ponding'),
        createData('2019-08-02 07:30:00', 'Slope failure', '53cm', 'Gumuho ang lupa malapit sa sakahan'),
        createData('2019-08-01 07:30:00', 'Crack', 'John Geliberte', 'May bagong Crack malapit sa Crack C'),
        createData('2019-07-30 07:30:00', 'Crack', 'John Geliberte', 'May bagong Crack malapit sa Crack C')
    ];
    const dt_classes = tableStyle();
    const classes = useStyles();

    const [openRaise, setOpenRaise] = useState(false);
    const [momsContainer, setMomsContainer] = useState([]);

    const [datatable, setDatatable] = useState([]);

    useEffect(()=> {
        initMoms();
    },[]);
    const initMoms = (site_code = 29) => {
        fetch(`${AppConfig.HOSTNAME}/api/ground_data/moms/fetch/${site_code}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                let moms_container = [];
                responseJson.data.forEach(element => {
                    const [feature_id, instance_id, site_id, feature_name, 
                        location, reporter, moms_id, observace_ts, reporter_id,
                        remarks, validator, op_trigger, feature_type, feature_desc] = element
                    let temp = {
                    "instance_id":instance_id,
                    "site_id":site_id,
                    "feature_id":feature_id,
                    "feature_name":feature_name,
                    "location":location,
                    "reporter":reporter,
                    "moms_id":moms_id,
                    "observance_ts":moment(observace_ts).format('YYYY-MM-DD HH:mm:ss'),
                    "reporter_id":reporter_id,
                    "remarks":remarks,
                    "validator":validator,
                    "op_trigger":op_trigger,
                    "feature_type": feature_type,
                    "feature_desc": feature_desc
                    }
                    moms_container.push(temp)
                });
                setMomsContainer(moms_container);
                console.log(moms_container)
                setDatatable(moms_container);
            })
            .catch((error) => {
                console.log(error);
            }
        );
    }

    const handleClickOpenModalMoms = (data) => {
        console.log(data)
        setOpenForm(true);
    };

    const handleCloseRaise = () => {
        setOpenRaise(false);
    };

    const [openForm, setOpenForm] = React.useState(false);

    const handleClickOpenForm = () => {
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
    };

    return (
        <Fragment>

            <Dialog
                open={openRaise}
                onClose={handleCloseRaise}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Raise Manifestation of movement?"}</DialogTitle>
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

            <Dialog
                open={openForm}
                onClose={handleCloseForm}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Manifestation of Movements</DialogTitle>
                <DialogContent>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DateTimePicker
                        autoOk
                        ampm={false}
                        disableFuture
                        format="YYYY-MM-DD HH:mm:ss"
                        value={moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}
                        onChange={(date) => { console.log(moment(date).format("YYYY-MM-DD HH:mm:ss")) }}
                        label="Date time"
                        fullWidth
                    />
                </MuiPickersUtilsProvider>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Feature"
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
                        label="Description"
                        type="email"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseForm} color="primary">
                        Cancel
            </Button>
                    <Button onClick={handleCloseForm} color="primary" autoFocus>
                        Confirm
            </Button>
                </DialogActions>
            </Dialog>

            <Container fixed>
                <Grid container align="center" spacing={2}>
                    <Grid item xs={12}>
                        <Paper className={dt_classes.root}>
                            <Table className={dt_classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date and time</TableCell>
                                        <TableCell>Feature type</TableCell>
                                        <TableCell>Feature name</TableCell>
                                        <TableCell>Location</TableCell>
                                        <TableCell>Reporter</TableCell>
                                        <TableCell>Description</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        datatable.length == 0 ?
                                        <TableRow>
                                            <Typography variant="h5" align="center">
                                                No data available
                                            </Typography>
                                        </TableRow>
                                        :
                                        datatable.map(row => (
                                            <TableRow key={row.observance_ts} onClick={()=> {handleClickOpenModalMoms(row)}} >
                                                <TableCell component="th" scope="row">
                                                    {row.observance_ts}
                                                </TableCell>
                                                <TableCell>{row.feature_type}</TableCell>
                                                <TableCell>{row.feature_name}</TableCell>
                                                <TableCell>{row.location}</TableCell>
                                                <TableCell>{row.validator}</TableCell>
                                                <TableCell>{row.feature_desc}</TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2">
                            * click row to Raise/Modify/Remove Manifestation of Movements data.
                        </Typography>
                    </Grid>
                    <Grid container align="center" style={{ paddingTop: 20 }}>

                        <Grid item xs={3} />
                        <Grid item xs={2}>
                            <Fab variant="extended"
                                color="primary"
                                aria-label="add" className={classes.button_fluid}
                                onClick={handleClickOpenForm}>
                                Add MoMs
                        </Fab>
                        </Grid>
                        <Grid item xs={2}>
                            <Fab variant="extended"
                                color="primary"
                                aria-label="add" className={classes.button_fluid}
                                onClick={() => { }}>
                                Download
                        </Fab>
                        </Grid>
                        <Grid item xs={2}>
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
            </Container>
        </Fragment>
    )
}

export default MoMs