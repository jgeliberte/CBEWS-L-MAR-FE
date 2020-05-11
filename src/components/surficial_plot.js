import React, { useState, useEffect,Fragment } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import TransitionalModal from '../reducers/loading';
import moment from "moment";
import {
    Grid, Paper, Container, Fab, makeStyles, Typography
} from "@material-ui/core";
import AppConfig from "../reducers/AppConfig";
import { useCookies } from 'react-cookie';
require("highcharts/modules/exporting")(Highcharts);

const useStyles = makeStyles(theme => ({

    button_fluid: {
        width: '90%',
        padding: 10
    },

}));

function prepareOptions(input, data, width) {
    const subtext = "";
    const { site_code, timestamps } = input;
    const { start, end } = timestamps
    const start_date = moment(start, "YYYY-MM-DD HH:mm:ss");
    const end_date = moment(end, "YYYY-MM-DD HH:mm:ss");
    
    data.forEach(element => {
        element.data.forEach(row => {
            row.x =  Date.parse(moment.unix(row.x).format("YYYY-MM-DD HH:mm:ss"))
        });
    });

    const font_size = "1rem"
    return {
        title: {    
            text: `<b>Surficial Data History Chart of ${site_code.toUpperCase()}</b>`,
            style: { fontSize: font_size },
            margin: 36,
            y: 18
        },
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
            text: `${subtext}As of: <b>${moment(end_date).format("YYYY-MM-DD HH:mm:ss")}</b>`,
            style: { fontSize: "0.75rem" }
        },
        yAxis: {
            title: {
                text: "<b>Displacement (cm)</b>"
            }
        },
        xAxis: {
            min:  Date.parse(start_date),
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

    const chartRef = React.useRef(null);
    const [timestamps, setTimestamps] = useState();
    const [modal, setModal] = useState([<TransitionalModal status={false} />])
    const classes = useStyles();
    const [load, setLoad] = useState(false);
    const [graphComponent, setGraphComponent] = useState([]);
    const [cookies, setCookie] = useCookies(['credentials']);

    useEffect(() => {
        initSurficial(cookies.credentials.site_code);
    }, [])

    const initSurficial = (site_code = 'mar') => {
        fetch(`${AppConfig.HOSTNAME}/api/data_analysis/surficial/plot/data/${site_code}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                let {site_code, ts_start, ts_end} = responseJson;
                let timestamps = {start: ts_start, end: ts_end};
                let input = {site_code, timestamps};
                let graph = createSurficialGraph(input, responseJson.surficial_plot, chartRef)
                setGraphComponent(graph);
                setTimestamps(timestamps);
                setLoad(true);
            })
            .catch((error) => {
                console.log(error);
            }
        );
    }

    return (
        <Fragment>
            <Container align="center" justify="center" style={{ marginTop: 24 }}>
                <Grid Container>
                    <Grid item xs={12}>
                        <Paper>
                            {
                                load ? graphComponent : <Typography>Loading</Typography>
                            }
                        </Paper>
                    </Grid>

                </Grid>
            </Container>
            {modal}
        </Fragment>
    );
}

export default SurficialPlot;