import React, { Fragment } from 'react';
import {
    Grid, Paper, Container,
    Fab, makeStyles, Table,
    TableBody, TableCell, TableHead,
    TableRow, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, Button, Box, TextField
} from "@material-ui/core";


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

    const [openRaise, setOpenRaise] = React.useState(false);

    const handleClickOpenRaise = () => {
        setOpenRaise(true);
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
                                        <TableCell>Feature</TableCell>
                                        <TableCell>Reporter</TableCell>
                                        <TableCell>Description</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map(row => (
                                        <TableRow key={row.date_time} onClick={handleClickOpenRaise}>
                                            <TableCell component="th" scope="row">
                                                {row.date_time}
                                            </TableCell>
                                            <TableCell>{row.feature}</TableCell>
                                            <TableCell>{row.reporter}</TableCell>
                                            <TableCell>{row.description}</TableCell>
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