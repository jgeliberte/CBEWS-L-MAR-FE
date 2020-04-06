import React, {Fragment, useEffect, useState} from 'react';
import {
    Grid, Paper, Container,
    Fab, makeStyles, Table,
    TableBody, TableCell, TableHead,
    TableRow, TextField, Button, TablePagination
} from "@material-ui/core";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';

import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
    KeyboardDateTimePicker,
    DateTimePicker
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

function SurficialMarker() {
    const [markersTH, setMarkersTH] = useState([]);
    const [dtRow, setDtRow] = useState([]);

    const [markerData, setMarkerData] = useState([]);
    const [markerNames, setMarkerNames] = useState([]);

    const [selectedSurficialMarker, setSelectedSurficialMarker] = useState();
    const [editableTS, setEditableTS] = useState();
    const [editableWeather, setEditableWeather] = useState();
    const [editableObserver, setEditableObserver] = useState();
    const [editableMarkerValues, setEditableMarkerValues] = useState();

    const [modificationModal, setModificationModal] = useState(false);
    const [markerFields, setMarkerFields] = useState([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);


    useEffect(()=> {
        initSurficialMarker()
    },[])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        let start = newPage*10;
        let end = (newPage*10)+10;
        setDtRow(markerData.slice(start,end))
      };
    
    const handleChangeRowsPerPage = event => {
        console.log(parseInt(event.target.value, 10));
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    
    const initSurficialMarker = () => {
        fetch(`${AppConfig.HOSTNAME}/api/ground_data/surficial_markers/fetch/29`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                let temp_th = []
                let temp_tr = []
                let temp_dr = []
                let temp = []

                setMarkerNames(responseJson.markers);

                responseJson.markers.forEach(element => {
                    temp_th.push(
                        <TableCell>{element[1].toUpperCase()}</TableCell>
                    )
                });

                setMarkersTH(temp_th);
                responseJson.data.forEach(element => {
                    let temp_obj = {};
                    let temp_dr = [];
                    let marker_data = Object.values(element)[0];

                    temp_obj['ts'] = marker_data.ts
                    responseJson.markers.forEach(marker_element => {
                        temp_obj[marker_element[1]] = marker_data[marker_element[1]]
                    });
                    temp_obj['weather'] = marker_data.weather
                    temp_obj['observer'] = marker_data.observer
                    temp_tr.push(temp_obj)
                });

                temp_tr.forEach(element => {
                    temp = [];
                    temp_dr.push(
                        <TableRow key={element.ts} onClick={()=> {handleModificationModalOpen(element)}}>
                            <TableCell component="th" scope="row">
                                {element.ts}
                            </TableCell>
                                {responseJson.markers.forEach(marker_element => {
                                temp.push(<TableCell>{element[marker_element[1]]}</TableCell>) 
                                })}
                                {temp}
                            <TableCell>{element.weather}</TableCell>
                            <TableCell>{element.observer}</TableCell>
                        </TableRow>
                    ) 
                });
                setMarkerData(temp_dr)
                setDtRow(temp_dr.slice(0,10))
            })
            .catch((error) => {
                console.log(error);
            }
        );
    }

    function createData(date_time, a, b, c, weather, nag_sukat, nag_encode ) {
        return { date_time, a, b, c, weather, nag_sukat, nag_encode };
    }

    const rows = [
        createData('2019-08-08 07:30:00', '60cm', '58cm', '20cm','MAULAN','Juan Dela Cruz', 'John Geliberte'),
        createData('2019-08-07 07:30:00', '60cm', '57cm', '20cm','MAARAW','Juan Dela Cruz', 'John Geliberte'),
        createData('2019-08-06 07:30:00', '60cm', '56cm', '20cm','MAULAN','Juan Dela Cruz', 'John Geliberte'),
        createData('2019-08-05 07:30:00', '60cm', '54cm', '20cm','MAULAN','Juan Dela Cruz', 'John Geliberte'),
        createData('2019-08-04 07:30:00', '60cm', '54cm', '20cm','MAULAP','Juan Dela Cruz', 'John Geliberte'),
        createData('2019-08-03 07:30:00', '60cm', '53cm', '20cm','MAULAN','Juan Dela Cruz', 'John Geliberte'),
        createData('2019-08-02 07:30:00', '60cm', '53cm', '20cm','MAARAW','Juan Dela Cruz', 'John Geliberte'),
        createData('2019-08-01 07:30:00', '59cm', '53cm', '20cm','MAULAN','Juan Dela Cruz', 'John Geliberte'),
        createData('2019-07-30 07:30:00', '58cm', '53cm', '20cm','MAULAN','Juan Dela Cruz', 'John Geliberte')
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

    const handleModificationModalClose = () => {
        setModificationModal(false);
    };
    
    const onChangeMarkerFieldValues = (key, value, original) => {
        switch(key) {
            case 'ts':
                original[key] = value;
                setEditableTS(moment(value).format("YYYY-MM-DD HH:mm:ss"));
                break;
            case 'observer':
            case 'weather':
                original[key] = value;
                break;
            default:
                original[key] = parseInt(value);
                break;
        }
        setSelectedSurficialMarker(original)
    }

    const handleModificationModalOpen = (element) => {
        let temp = element;
        let ret_val = [];

        setSelectedSurficialMarker(element);
        setEditableTS(moment(element.ts).format("YYYY-MM-DD HH:mm:ss"))

        Object.keys(element).forEach(obj_element => {
            switch(obj_element) {
                case 'ts':
                    console.log("DO NOTHING");
                    break;
                case 'weather':
                    ret_val.push(
                        <TextField
                        autoFocus
                        margin="dense"
                        onChange={(e)=> {onChangeMarkerFieldValues(obj_element,e.target.value, element)}}
                        defaultValue={element[obj_element]}
                        id="weather"
                        label="Weather"
                        fullWidth
                    />
                    )
                    break;
                case 'observer':
                    ret_val.push(
                        <TextField
                        autoFocus
                        margin="dense"
                        onChange={(e)=> {onChangeMarkerFieldValues(obj_element,e.target.value, element)}}
                        defaultValue={element[obj_element]}
                        id="observer"
                        label="Nag-sukat"
                        fullWidth
                    />
                    )
                    break;
                default:
                    let marker_id = `marker_${obj_element}`;
                    ret_val.push(<TextField
                        autoFocus
                        margin="dense"
                        defaultValue={element[obj_element]}
                        id={marker_id}
                        label={`Marker ${obj_element}`}
                        type="number"
                        onChange={(e)=> {onChangeMarkerFieldValues(obj_element,e.target.value, element)}}
                        fullWidth
                    />)
                    break;
            }
        });
        setMarkerFields(ret_val);
        setModificationModal(true);
    };

    const updateMarkerData = () => {
        let temp = selectedSurficialMarker;
        let temp_markers = {};

        Object.keys(temp).forEach(element => {
            switch (element) {
                case 'ts':
                case 'weather':
                case 'observer':
                    console.log("Skipping reconstruction");
                    break;
                default:
                    temp_markers[element] = temp[element]
                    break;
            }
        });

        let request = {
          "site_id": 29,
          "ref_ts": selectedSurficialMarker.ts,
          "new_ts": editableTS,
          "weather": selectedSurficialMarker.weather,
          "observer": selectedSurficialMarker.observer,
          "marker_values": temp_markers
        }

        console.log(request);

        fetch(`${AppConfig.HOSTNAME}/api/ground_data/surficial_markers/modify`, {
          method: 'PATCH',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        }).then((response) => response.json())
          .then((responseJson) => {
            if (responseJson.status == true) {
                initSurficialMarker();
                handleModificationModalClose();
            } else {
                console.log(responseJson);
                // Enhance UI alerts
            }
          })
          .catch((error) => {
            console.log(error)
          }
        );
    }

    const deleteMarkerData = () => {
        console.log(selectedSurficialMarker);
        console.log(editableTS)
    }

    return (
        <Fragment>
            <Dialog
                open={modificationModal}
                onClose={handleModificationModalClose}
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
                            value={editableTS}
                            onChange={(date) => {setEditableTS(moment(date).format("YYYY-MM-DD HH:mm:ss"))}}
                            label="Date time"
                            fullWidth
                        />
                    </MuiPickersUtilsProvider>
                    {markerFields}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModificationModalClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={deleteMarkerData} color="primary">
                        Delete
                    </Button>
                    <Button onClick={updateMarkerData} color="primary" autoFocus>
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

        <Container fixed>
            <Grid container align="center" spacing={10}>
                <Grid item xs={12}>
                    <Paper className={dt_classes.root}>
                        <Table className={dt_classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date and time</TableCell>
                                    {markersTH}
                                    <TableCell>Weather</TableCell>
                                    <TableCell>Nag-sukat</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {dtRow}
                            </TableBody>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={markerData.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                            />
                        </Table>
                    </Paper>
                </Grid>
                <Grid container align="center" style={{ paddingTop: 20 }}>
                    <Grid item xs={2} />
                    <Grid item xs={3}>
                        <Fab variant="extended"
                            color="primary"
                            aria-label="add" className={classes.button_fluid}
                            onClick={handleClickOpen}>
                            Add Ground Measurement
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
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Ground measurement</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
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
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Marker A"
                            type="email"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Marker B"
                            type="email"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Marker C"
                            type="email"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Weather"
                            type="email"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Nag sukat"
                            type="email"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Nag encode"
                            type="email"
                            fullWidth
                        />
                    </Grid>
                </Grid>
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

export default SurficialMarker