import React, { useState, Fragment } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import TransitionalModal from '../reducers/loading';
import moment from "moment";
import {
    Grid, Paper, Container, Fab, makeStyles
} from "@material-ui/core";

import { getSurficialPlotData } from './sample_surficial_not_final'

const useStyles = makeStyles(theme => ({

    button_fluid: {
        width: '90%',
        padding: 10
    },

}));

function prepareOptions(input, data, width) {
    const subtext = "";
    const { site_code, timestamps } = input;
    const { start, end } = timestamps;
    const start_date = moment(start, "YYYY-MM-DD HH:mm:ss");
    const end_date = moment(end, "YYYY-MM-DD HH:mm:ss");

    const font_size = "1rem"

    return {
        title: {
            text: `<b>Surficial Data History Chart of ${site_code.toUpperCase()}</b>`,
            style: { fontSize: font_size },
            margin: 36,
            y: 18
        },
        time: { timezoneOffset: -8 * 60 },
        series: data,
        chart: {
            type: "line",
            zoomType: "x",
            panning: true,
            panKey: "shift",
            height: 400,
            resetZoomButton: {
                position: {
                    x: 0,
                    y: -30
                }
            },
            spacingTop: 24,
            spacingRight: 24
        },
        subtitle: {
            text: `${subtext}As of: <b>${moment(end_date).format("D MMM YYYY, HH:mm")}</b>`,
            style: { fontSize: "0.75rem" }
        },
        yAxis: {
            title: {
                text: "<b>Displacement (cm)</b>"
            }
        },
        xAxis: {
            min: Date.parse(start_date),
            max: Date.parse(end_date),
            type: "datetime",
            dateTimeLabelFormats: {
                month: "%e. %b %Y",
                year: "%b"
            },
            title: {
                text: "<b>Date</b>"
            },
        },
        tooltip: {
            shared: true,
            crosshairs: true
        },
        plotOptions: {
            line: {
                marker: {
                    enabled: true
                },
                dashStyle: "ShortDash"
            },
            series: {
                marker: {
                    radius: 3
                },
                cursor: "pointer",
                point: {}
            }
        },
        loading: {
            showDuration: 100,
            hideDuration: 1000
        },
        credits: {
            enabled: false
        }
    };
}

function createSurficialGraph(input, surficial_data, chartRef, width = "md") {
    const options = prepareOptions(input, surficial_data, width);

    return <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartRef}
    />;
}

function SurficialPlot(props) {
    console.log(props)
    const chartRef = React.useRef(null);
    const site_code = "MAR"
    const [timestamps, setTimestamps] = useState({ start: "2018-11-08 00:00:00", end: "2019-01-09 00:00:00" });
    const [modal, setModal] = useState([<TransitionalModal status={false} />])
    const classes = useStyles();
    let surficial_data = [];
    surficial_data = getSurficialPlotData

    const input = { site_code, timestamps };
    const graph_component = createSurficialGraph(input, surficial_data, chartRef);

    function downloadGraph() {
        setModal([<TransitionalModal status={true} />])
        setTimeout(() => {
            setModal([<TransitionalModal status={false} />])
            alert("Download success!")
        }, 3000)
    }

    function printGraph() {
        setModal([<TransitionalModal status={true} />])
        setTimeout(() => {
            setModal([<TransitionalModal status={false} />])
            alert("Print success!")
        }, 3000)
    }

    return (
        <Fragment>
            <Container align="center" justify="center" style={{ marginTop: 24 }}>
                <Grid Container>
                    <Grid item xs={12}>
                        <Paper>
                            {graph_component}
                        </Paper>

                    </Grid>
                    <Grid container align="center" style={{ paddingTop: 20 }}>
                        <Grid item xs={3} />
                        <Grid item xs={3}>
                            <Fab variant="extended"
                                color="primary"
                                aria-label="add" className={classes.button_fluid}
                                onClick={() => {downloadGraph()}}>
                                Download
                        </Fab>
                        </Grid>
                        <Grid item xs={3}>
                            <Fab variant="extended"
                                color="primary"
                                aria-label="add" className={classes.button_fluid}
                                onClick={() => {printGraph()}}>
                                Print
                        </Fab>
                        </Grid>
                        <Grid item xs={3} />
                    </Grid>

                </Grid>
            </Container>
            {modal}
        </Fragment>
    );
}

export default SurficialPlot;