import React, { useState, useEffect, Fragment } from 'react';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import * as moment from "moment";
import {
    Grid, Paper, Container,
    Fab, makeStyles, Table,
    TableBody, TableCell, TableHead,
    TableRow, Typography
} from "@material-ui/core";
import { sample_rain_data } from "./sample_rain_data._not_final";
import TransitionalModal from '../reducers/loading';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import AppConfig from "../reducers/AppConfig";

window.moment = moment;

const rainfall_colors = {
    "24h": "rgba(73, 105, 252, 0.9)",
    "72h": "rgba(239, 69, 50, 0.9)",
    rain: "rgba(0, 0, 0, 0.9)"
};

const useStyles = makeStyles(theme => ({
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
        minWidth: 100,
    },
}));

function prepareRainfallData(set) {
    const series_data = [];
    const max_rval_data = [];
    const hr_24 = [];
    const hr_72 = [];
    const rain = [];
    const max_72h = 0;

    set.data.forEach((hr24) => {
        hr_24.push([moment(hr24.ts).unix(), hr24['24hr cumulative rainfall']])
    })

    set.data.forEach((hr72) => {
        hr_72.push([moment(hr72.ts).unix(), hr72['72hr cumulative rainfall']])
    })

    set.data.forEach((data) => {
        rain.push([moment(data.ts).unix(), data['rain']])
    })

    delete set['data']

    set['24h'] = hr_24;
    set['72h'] = hr_72;
    set['rain'] = rain;
    let null_ranges = [{from: moment(set['ts_start']).unix(), to: moment(set['ts_end']).unix()}]
    set['null_ranges'] = null_ranges;
    Object.keys(rainfall_colors).forEach((name) => {
        set[name].forEach(element => {
            if (element[1] == undefined) {
                element[1] = 0;
            }
        });
        const color = rainfall_colors[name];
        const entry = {
            name,
            step: true,
            data: set[name],
            color,
            id: name,
            fillOpacity: 1,
            lineWidth: 1
        };

        if (name !== "rain") series_data.push(entry);
        else max_rval_data.push(entry);
    });

    const null_processed = null_ranges.map(({ from, to }) => ({ from, to, color: "rgba(68, 170, 213, 0.3)" }));
    return { set, series_data, max_rval_data , null_processed};
}

function prepareInstantaneousRainfallChartOption(row, input) {
    const { set, max_rval_data, null_processed } = row;
    const {
        distance, max_rval, gauge_name
    } = set;
    const { ts_start, ts_end, site_code } = input;

    return {
        series: max_rval_data,
        chart: {
            type: "column",
            zoomType: "x",
            panning: true,
            resetZoomButton: {
                position: {
                    x: 0,
                    y: -30
                }
            },
            spacingTop: 16,
            spacingRight: 24
        },
        title: {
            text: `<b>Instantaneous Rainfall Chart of ${site_code.toUpperCase()}</b>`,
            style: { fontSize: "1rem" },
            margin: 26,
            y: 20
        },
        subtitle: {
            text: `Source : <b>${createRainPlotSubtitle(distance, gauge_name)}</b><br/>As of: <b>${moment(ts_end).format("D MMM YYYY, HH:mm")}</b>`,
            style: { fontSize: "0.80rem" }
        },
        xAxis: {
            min: Date.parse(ts_start),
            max: Date.parse(ts_end),
            plotBands: null_processed,
            type: "datetime",
            dateTimeLabelFormats: {
                month: "%e %b %Y",
                year: "%Y"
            },
            title: {
                text: "<b>Date</b>"
            },
            events: {
                setExtremes: syncExtremes
            }
        },
        yAxis: {
            max: max_rval,
            min: 0,
            title: {
                text: "<b>Value (mm)</b>"
            }
        },
        tooltip: {
            shared: true,
            crosshairs: true
        },
        plotOptions: {
            series: {
                marker: {
                    radius: 3
                },
                cursor: "pointer"
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        time: { timezoneOffset: -8 * 60 }
    };
}

function prepareCumulativeRainfallChartOption(row, input) {
    const { set, series_data } = row;
    const {
        distance,
        threshold_value: max_rain_2year, gauge_name
    } = set;
    const max_72h = 0;
    
    const { ts_start, ts_end, site_code } = input;
    console.log(series_data);
    return {
        series: series_data,
        chart: {
            type: "line",
            zoomType: "x",
            panning: true,
            panKey: "shift",
            resetZoomButton: {
                position: {
                    x: 0,
                    y: -30
                }
            },
            spacingTop: 16,
            spacingRight: 24
        },
        title: {
            text: `<b>Cumulative Rainfall Chart of ${site_code.toUpperCase()}</b>`,
            style: { fontSize: "1rem" },
            margin: 20,
            y: 20
        },
        subtitle: {
            text: `Source: <b>${createRainPlotSubtitle(distance, gauge_name)}</b><br/>As of: <b>${moment(ts_end).format("D MMM YYYY, HH:mm")}</b>`,
            style: { fontSize: "0.80rem" }
        },
        xAxis: {
            min: Date.parse(ts_start),
            max: Date.parse(ts_end),
            type: "datetime",
            dateTimeLabelFormats: {
                month: "%e %b %Y",
                year: "%Y"
            },
            title: {
                text: "<b>Date</b>"
            },
            events: {
                setExtremes: syncExtremes
            }
        },
        yAxis: {
            title: {
                text: "<b>Value (mm)</b>"
            },
            max: Math.max(0, (max_72h - parseFloat())) + parseFloat(max_rain_2year),
            min: 0,
            plotBands: [{
                value: Math.round(parseFloat(max_rain_2year / 2) * 10) / 10,
                color: rainfall_colors["24h"],
                dashStyle: "shortdash",
                width: 2,
                zIndex: 0,
                label: {
                    text: `24-hr threshold (${max_rain_2year / 2})`

                }
            }, {
                value: max_rain_2year,
                color: rainfall_colors["72h"],
                dashStyle: "shortdash",
                width: 2,
                zIndex: 0,
                label: {
                    text: `72-hr threshold (${max_rain_2year})`
                }
            }]
        },
        tooltip: {
            shared: true,
            crosshairs: true
        },
        plotOptions: {
            series: {
                marker: {
                    radius: 3
                },
                cursor: "pointer"
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        time: { timezoneOffset: -8 * 60 }
    };
}

function createRainPlotSubtitle(distance, gauge_name) {
    const source = gauge_name.toUpperCase();
    const subtitle = distance === null ? source : `${source} (${distance} KM)`;
    return subtitle;
}

function syncExtremes(e) {
    const this_chart = this.chart;
    const { charts } = Highcharts;

    if (e.trigger !== "syncExtremes") { // Prevent feedback loop
        Highcharts.each(charts, (chart) => {
            if (chart !== this_chart) {
                if (chart.xAxis[0].setExtremes) { // It is null while updating
                    chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, { trigger: "syncExtremes" });
                }
            }
        });
    }
}

// function RainfallPlot(props) {
//     const { feature } = props
//     const input = { ts_end: "2019-06-24 01:00:00", ts_start: "2019-06-17 01:00:00", site_code: "MAR" };
//     const [selectedStartDate, setSelectedStartDate] = useState(new Date());
//     const [selectedEndDate, setSelectedEndDate] = useState(new Date());
//     const processed_data = [];

//     const fetchRainfall = (site_code = 'umi') => {
//         return fetch(`${AppConfig.HOSTNAME}/api/data_analysis/rainfall/plot/data/${site_code}`, {
//             method: 'GET',
//             headers: {
//                 Accept: 'application/json',
//                 'Content-Type': 'application/json',
//             }
//         }).then((response) => response.json())
//     }

//     function renderGraph() {
//         const temp = [];
//         processed_data.forEach(data => {
//             if (feature === "data_analysis" || feature === "alert_validation") {
//                 const cumulative = prepareCumulativeRainfallChartOption(data, input);
//                 temp.push({ cumulative });
//             } else {
//                 const instantaneous = prepareInstantaneousRainfallChartOption(data, input);
//                 temp.push({ instantaneous });
//             }
//         });
//         return temp
//     }

//     const [rainfallData, setRainfallData] = useState(fetchRainfall);
//     const [options, setOptions] = useState(renderGraph());

//     const [modal, setModal] = useState([<TransitionalModal status={false} />])

//     const classes = useStyles();
//     const dt_classes = tableStyle();

//     // const rainfall_data = fetchRainfallPlotData();
//     // console.log(rainfall_data)
//     // rainfall_data.forEach(set => {
//     //     const data = prepareRainfallData(set);
//     //     processed_data.push(data);
//     // });



//     const handleSelectedStartDate = date => {
//         setSelectedStartDate(date);
//     };

//     const handleSelectedEndDate = date => {
//         setSelectedEndDate(date);
//     };

//     function enableDownloadPrint(feature) {
//         if (feature === "data_analysis") {
//             return (
//                 <Grid container align="center" style={{ paddingTop: 20 }}>
//                     <Grid item xs={3} />
//                     <Grid item xs={3}>
//                         <Fab variant="extended"
//                             color="primary"
//                             aria-label="add" classNarainfall_datame={classes.button_fluid}
//                             onClick={() => { console.log(rainfallData); downloadGraph(); }}>
//                             Download
//                 </Fab>
//                     </Grid>
//                     <Grid item xs={3}>
//                         <Fab variant="extended"
//                             color="primary"
//                             aria-label="add" className={classes.button_fluid}
//                             onClick={() => { printGraph() }}>
//                             Print
//                 </Fab>
//                     </Grid>
//                     <Grid item xs={3} />
//                 </Grid>
//             )
//         }
//     }

//     function enableDataGeneratorOptions(feature) {
//         let ret_val = [];
//         if (feature === "sensor_data") {
//             ret_val.push(
//                 <Grid container align="center" style={{ paddingTop: 20 }}>
//                     <Grid item xs={2} />
//                     <Grid item xs={3}>
//                         <MuiPickersUtilsProvider utils={MomentUtils}>
//                             <KeyboardDatePicker
//                                 disableToolbar
//                                 variant="inline"
//                                 format="MM-DD-YYYY HH:mm:ss"
//                                 margin="normal"
//                                 id="date-picker-start"
//                                 label="Date Start"
//                                 value={selectedStartDate}
//                                 onChange={handleSelectedStartDate}
//                                 KeyboardButtonProps={{
//                                     'aria-label': 'change date',
//                                 }}
//                             />
//                         </MuiPickersUtilsProvider>
//                     </Grid>
//                     <Grid item xs={3}>
//                         <MuiPickersUtilsProvider utils={MomentUtils}>
//                             <KeyboardDatePicker
//                                 disableToolbar
//                                 variant="inline"
//                                 format="MM-DD-YYYY HH:mm:ss"
//                                 margin="normal"
//                                 id="date-picker-end"
//                                 label="Date End"
//                                 value={selectedEndDate}
//                                 onChange={handleSelectedEndDate}
//                                 KeyboardButtonProps={{
//                                     'aria-label': 'change date',
//                                 }}
//                             />
//                         </MuiPickersUtilsProvider>
//                     </Grid>
//                     <Grid item xs={2}>
//                         <Fab variant="extended"
//                             color="primary"
//                             aria-label="add" className={classes.button_fluid}
//                             onClick={() => { }}>
//                             Generate
//                         </Fab>
//                     </Grid>
//                     <Grid item xs={2} />
//                 </Grid>
//             )
//         }
//         return ret_val;
//     };

//     function downloadGraph() {
//         setModal([<TransitionalModal status={true} />])
//         setTimeout(() => {
//             setModal([<TransitionalModal status={false} />])
//             alert("Download success!")
//         }, 3000)
//     }

//     function printGraph() {
//         setModal([<TransitionalModal status={true} />])
//         setTimeout(() => {
//             setModal([<TransitionalModal status={false} />])
//             alert("Print success!")
//         }, 3000)
//     }

//     function createData(date_time, mm) {
//         return { date_time, mm };
//     }

//     const rows = [
//         createData('2019-10-06 04:00:00', '30 mm'),
//         createData('2019-10-06 03:30:00', '02 mm'),
//         createData('2019-10-06 03:00:00', '07 mm'),
//         createData('2019-10-06 02:30:00', '10 mm'),
//         createData('2019-10-06 02:00:00', '00 mm'),
//         createData('2019-10-06 01:30:00', '01 mm'),
//         createData('2019-10-06 01:00:00', '00 mm'),
//     ];

//     return (
//         <Fragment>
//         </Fragment>
//         // {<Fragment>
//         //     <Container>
//         //         <Grid container spacing={4}>
//         //             {
//         //                 options.map((option, i) => {
//         //                     let opt;
//         //                     let grid_size;
//         //                     let instantaneous_table = []
//         //                     if (feature === "data_analysis" || feature === "alert_validation") {
//         //                         opt = option.cumulative;
//         //                         grid_size = 12
//         //                     } else {
//         //                         opt = option.instantaneous;
//         //                         grid_size = 6
//         //                         instantaneous_table.push(

//         //                             <Grid item xs={grid_size}>
//         //                                 <Paper>
//         //                                     <Table className={dt_classes.table}>
//         //                                         <TableHead>
//         //                                             <TableRow>
//         //                                                 <TableCell>Date and time</TableCell>
//         //                                                 <TableCell>Rain (mm / 30 mins)</TableCell>
//         //                                             </TableRow>
//         //                                         </TableHead>
//         //                                         <TableBody>
//         //                                             {rows.map(row => (
//         //                                                 <TableRow key={row.date_time}>
//         //                                                     <TableCell component="th" scope="row">
//         //                                                         {row.date_time}
//         //                                                     </TableCell>
//         //                                                     <TableCell>{row.mm}</TableCell>
//         //                                                 </TableRow>
//         //                                             ))}
//         //                                         </TableBody>
//         //                                     </Table>
//         //                                 </Paper>
//         //                             </Grid>
//         //                         )
//         //                     }

//         //                     return (
//         //                         <Fragment key={i}>
//         //                             <Grid item xs={grid_size} md={6}>
//         //                                 <Paper>
//         //                                     <HighchartsReact
//         //                                         highcharts={Highcharts}
//         //                                         options={opt}
//         //                                     />
//         //                                 </Paper>
//         //                             </Grid>
//         //                             {instantaneous_table}
//         //                         </Fragment>
//         //                     );
//         //                 })
//         //             }
//         //         </Grid>
//         //         {enableDownloadPrint(feature)}
//         //         {enableDataGeneratorOptions(feature)}
//         //     </Container>
//         //     {modal}
//         // </Fragment>}
//     );
// }

function RainfallPlot(props) {

    const { feature } = props
    const input = { ts_end: "2019-06-24 01:00:00", ts_start: "2019-06-17 01:00:00", site_code: "MAR" };
    const [rainfallData, setRainfallData] = useState();
    const [options, setOptions] = useState();
    const [loadGraph, setLoadGraph] = useState(false);
    const processed_data = [];

    const classes = useStyles();
    const dt_classes = tableStyle();

    useEffect(() => {
        initRainfall()
    }, [])

    const initRainfall = (site_code = 'mar') => {
        console.log(`${AppConfig.HOSTNAME}/api/data_analysis/rainfall/plot/data/${site_code}`)
        fetch(`${AppConfig.HOSTNAME}/api/data_analysis/rainfall/plot/data/${site_code}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                let rainfall_data = responseJson[0];
                console.log(rainfall_data)
                setRainfallData(rainfall_data)
                prepRainPlot(rainfall_data.plot, rainfall_data.ts_start, rainfall_data.ts_end)
            })
            .catch((error) => {
                console.log(error);
            }
        );
    }

    const prepRainPlot = (rainfall, ts_start, ts_end) => {
        rainfall.forEach(set => {
            const data = prepareRainfallData(set, ts_start, ts_end);
            processed_data.push(data);
        });
        setOptions(renderGraph(processed_data, ts_start, ts_end))
        setLoadGraph(true);
    }

    const renderGraph = (processed_data, start, end) => {
        const temp = [];
        const input = {ts_end: end, ts_start: start, site_code: "MAR"}
        processed_data.forEach(data => {
            if (feature === "data_analysis" || feature === "alert_validation") {
                const cumulative = prepareCumulativeRainfallChartOption(data, input);
                console.log(cumulative)
                temp.push({ cumulative });
            } else {
                const instantaneous = prepareInstantaneousRainfallChartOption(data, input);
                temp.push({ instantaneous });
            }

        });
        return temp
    }

    const createData = (date_time, mm ) => {
        return { date_time, mm};
    }

    const rows = [
        createData('2019-10-06 04:00:00', '30 mm'),
        createData('2019-10-06 03:30:00', '02 mm'),
        createData('2019-10-06 03:00:00', '07 mm'),
        createData('2019-10-06 02:30:00', '10 mm'),
        createData('2019-10-06 02:00:00', '00 mm'),
        createData('2019-10-06 01:30:00', '01 mm'),
        createData('2019-10-06 01:00:00', '00 mm'),
    ];

    return (
        <Fragment>
            <Container>
                <Grid container spacing={4}>
                    {
                        loadGraph ? options.map((option, i) => {
                            let opt;
                            let grid_size;
                            let instantaneous_table = []
                            if (feature === "data_analysis" || feature === "alert_validation") {
                                opt = option.cumulative;
                                grid_size = 12
                            } else {
                                opt = option.instantaneous;
                                grid_size = 6
                                instantaneous_table.push(

                                    <Grid item xs={grid_size}>
                                        <Paper>
                                            <Table className={dt_classes.table}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Date and time</TableCell>
                                                        <TableCell>Rain (mm / 30 mins)</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {rows.map(row => (
                                                        <TableRow key={row.date_time}>
                                                            <TableCell component="th" scope="row">
                                                                {row.date_time}
                                                            </TableCell>
                                                            <TableCell>{row.mm}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </Paper>
                                    </Grid>
                                )
                            }
                            return (
                                <Fragment key={i}>
                                    <Grid item xs={grid_size} md={6}>
                                        <Paper>
                                            <HighchartsReact
                                                highcharts={Highcharts}
                                                options={opt}
                                            />
                                        </Paper>
                                    </Grid>
                                    {instantaneous_table}
                                </Fragment>
                            );
                        }):
                        <Grid item xs={12}>
                            <Typography align='justify' variant='h2'>
                            Loading rainfall graph
                            </Typography>
                        </Grid>
                    }
                </Grid>
            </Container>
        </Fragment>
    )
}
export default RainfallPlot;