import React, {Fragment} from 'react';
import {
    Grid, Paper, Container,
    Fab, makeStyles, Table,
    TableBody, TableCell, TableHead,
    TableRow
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

function CapacityAndVulerability() {
    function createData(resource, quantity, status_description, owner, in_charge, updater) {
        return { resource, quantity, status_description, owner, in_charge, updater };
    }

    const rows = [
        createData('Megaphone', '6', 'working', 'Carlo Bontia','John Geliberte','Tine Dumagan'),
        createData('Two-way radio', '2', 'working', 'Carlo Bontia','John Geliberte','Tine Dumagan'),
        createData('Batingting', '1', 'broken', 'Carlo Bontia','John Geliberte','Tine Dumagan'),
        createData('Sirena', '5', 'working', 'Carlo Bontia','John Geliberte','Tine Dumagan'),
        createData('Cellphone', '10', 'broken', 'Carlo Bontia','John Geliberte','Tine Dumagan'),
        createData('Landline', '2', 'working', 'Carlo Bontia','John Geliberte','Tine Dumagan'),
    ];
    const dt_classes = tableStyle();
    const classes = useStyles();


    return (
        <Fragment>
        <Container fixed>
            <Grid container align="center" spacing={10}>
                <Grid item xs={12}>
                    <Paper className={dt_classes.root}>
                        <Table className={dt_classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Resource</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Status/Description</TableCell>
                                    <TableCell>Owner</TableCell>
                                    <TableCell>In-Charge</TableCell>
                                    <TableCell>Updater</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map(row => (
                                    <TableRow key={row.resource}>
                                        <TableCell component="th" scope="row">
                                            {row.resource}
                                        </TableCell>
                                        <TableCell>{row.quantity}</TableCell>
                                        <TableCell>{row.status_description}</TableCell>
                                        <TableCell>{row.owner}</TableCell>
                                        <TableCell>{row.in_charge}</TableCell>
                                        <TableCell>{row.updater}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
                <Grid container align="center" style={{ paddingTop: 20 }}>
                    <Grid item xs={4} />
                    <Grid item xs={4}>
                        <Fab variant="extended"
                            color="primary"
                            aria-label="add" className={classes.button_fluid}
                            onClick={() => {}}>
                            Add Entry
                        </Fab>
                    </Grid>
                    <Grid item xs={4} />
                </Grid>
            </Grid>
        </Container>
    </Fragment>
    )
}

export default CapacityAndVulerability