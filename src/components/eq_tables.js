import React, { Fragment, useEffect, useState } from 'react';
import {
    Grid, Paper, Container,
    Fab, Table,
    TableBody, TableCell, TableHead,
    TableRow, Typography, TablePagination
} from "@material-ui/core";
import { useStyles, tableStyle } from '../styles/general_styles';
import AppConfig from '../reducers/AppConfig';

function EarthquakeTables() {

    const [eqAvailable, setEqAvailable] = useState(false)
    const [eqData, setEqData] = useState([])
    const [eqDsiplay, setEqDisplay] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [pageEnd, setPageEnd] = useState(0);
    const createData = (date_time, depth, magnitude, latitude, longitude, distance, site ) =>  {
        return { date_time, depth, magnitude, latitude, longitude, distance, site };
    }

    useEffect(()=> {
        initEqTables();
    },[]);

    const initEqTables = (limit = 100) => {
        fetch(`${AppConfig.HOSTNAME}/api/sensor_data/earthquake/${limit}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                let temp = [];
                responseJson.data.forEach(element => {
                    temp.push(createData(
                        element.ts,
                        element.dept,
                        element.mag,
                        element.lon,
                        element.lat,
                        parseFloat(element.distance),
                        element.site
                    ))
                });
                setEqData(temp);
                setEqDisplay(temp);
                setEqAvailable(true);
            })
            .catch((error) => {
                console.log(error);
            }
        );
    }

    const dt_classes = tableStyle();
    const classes = useStyles();

    const handleChangePage = (event, newPage) => {
        console.log("Event value:", event.target.value)
        console.log("New page:", newPage)
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };

    return (
        <Fragment>
            <Container fixed>
                <Grid container align="center" spacing={10}>
                    <Grid item xs={12}>
                        { eqAvailable ? <Paper className={dt_classes.root}>
                        <Table className={dt_classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date and time</TableCell>
                                    <TableCell>Depth</TableCell>
                                    <TableCell>Magnitude</TableCell>
                                    <TableCell>Longitude</TableCell>
                                    <TableCell>Latitude</TableCell>
                                    <TableCell>Critical Distance</TableCell>
                                    <TableCell>Site(s) affected</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {eqDsiplay.map(row => {
                                    let ret_val = [];
                                    if (row.magnitude > 5) {
                                        ret_val.push(
                                            <TableRow key={row.date_time} style={{backgroundColor: '#e87d5b'}}>
                                                <TableCell component="th" scope="row">
                                                    {row.date_time}
                                                </TableCell>
                                                <TableCell>{row.depth}</TableCell>
                                                <TableCell>{row.magnitude}</TableCell>
                                                <TableCell>{row.latitude}</TableCell>
                                                <TableCell>{row.longitude}</TableCell>
                                                <TableCell>{row.distance}</TableCell>
                                                <TableCell>{row.site}</TableCell>
                                            </TableRow>
                                        )
                                    } else {
                                        ret_val.push(
                                            <TableRow key={row.date_time}>
                                                <TableCell component="th" scope="row">
                                                    {row.date_time}
                                                </TableCell>
                                                <TableCell>{row.depth}</TableCell>
                                                <TableCell>{row.magnitude}</TableCell>
                                                <TableCell>{row.latitude}</TableCell>
                                                <TableCell>{row.longitude}</TableCell>
                                                <TableCell>{row.distance}</TableCell>
                                                <TableCell>{row.site}</TableCell>
                                            </TableRow>
                                        )
                                    }
                                    return ret_val;
                                })}
                            </TableBody>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={eqData.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                            />
                        </Table>
                    </Paper> :
                    <Paper>
                        <Typography align='center'>
                                Loading earthquake plot
                        </Typography>
                    </Paper>
                    }
                    </Grid>
                    <Grid container align="center" style={{ paddingTop: 20 }}>
                        <Grid item xs={3} />
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
                        <Grid item xs={3} />
                    </Grid>
                </Grid>
            </Container>
        </Fragment>
    )
}

export default EarthquakeTables