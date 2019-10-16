import React, {Fragment} from 'react';
import {
    Grid, Paper, Container,
    Fab, makeStyles, Table,
    TableBody, TableCell, TableHead,
    TableRow, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, Button, Box
} from "@material-ui/core";


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
        return { date_time, feature, reporter, description};
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

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Fragment>

        <Dialog
            open={open}
            onClose={handleClose}
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
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={handleClose} color="primary" autoFocus>
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
                                    <TableRow key={row.date_time} onClick={handleClickOpen}>
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
                            onClick={() => {}}>
                            Add MoMs
                        </Fab>
                    </Grid>
                    <Grid item xs={2}>
                        <Fab variant="extended"
                            color="primary"
                            aria-label="add" className={classes.button_fluid}
                            onClick={() => {}}>
                            Download
                        </Fab>
                    </Grid>
                    <Grid item xs={2}>
                        <Fab variant="extended"
                            color="primary"
                            aria-label="add" className={classes.button_fluid}
                            onClick={() => {}}>
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