import React, {Fragment} from 'react';
import {
    Grid, Paper, Container,
    Fab, Table,
    TableBody, TableCell, TableHead,
    TableRow, TextField, Button
} from "@material-ui/core";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useStyles, tableStyle } from '../styles/general_styles';

import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

function CapacityAndVulerability() {
    function createData(date_time, resource, quantity, status_description, owner, in_charge, updater) {
        return { date_time, resource, quantity, status_description, owner, in_charge, updater };
    }

    const rows = [
        createData('2019-10-22 04:00:00','Megaphone', '6', 'working', 'Carlo Bontia','John Geliberte','Tine Dumagan'),
        createData('2019-10-22 04:00:00','Two-way radio', '2', 'working', 'Carlo Bontia','John Geliberte','Tine Dumagan'),
        createData('2019-10-22 04:00:00','Batingting', '1', 'broken', 'Carlo Bontia','John Geliberte','Tine Dumagan'),
        createData('2019-10-22 04:00:00','Sirena', '5', 'working', 'Carlo Bontia','John Geliberte','Tine Dumagan'),
        createData('2019-10-22 04:00:00','Cellphone', '10', 'broken', 'Carlo Bontia','John Geliberte','Tine Dumagan'),
        createData('2019-10-22 04:00:00','Landline', '2', 'working', 'Carlo Bontia','John Geliberte','Tine Dumagan'),
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
        <Container fixed>
            <Grid container align="center" spacing={10}>
                <Grid item xs={12}>
                    <Paper className={dt_classes.root}>
                        <Table className={dt_classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date time</TableCell>
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
                                    <TableRow key={row.date_time}>
                                        <TableCell component="th" scope="row">
                                            {row.date_time}
                                        </TableCell>
                                        <TableCell>{row.resource}</TableCell>
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
                            onClick={handleClickOpen}>
                            Add Entry
                        </Fab>
                    </Grid>
                    <Grid item xs={4} />
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
                label="Resource"
                type="email"
                fullWidth
            />
             <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Quantity"
                type="email"
                fullWidth
            />
             <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Status / Description"
                type="email"
                fullWidth
            />
             <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Owner"
                type="email"
                fullWidth
            />
             <TextField
                autoFocus
                margin="dense"
                id="name"
                label="In-charge"
                type="email"
                fullWidth
            />
             <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Updater"
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

export default CapacityAndVulerability