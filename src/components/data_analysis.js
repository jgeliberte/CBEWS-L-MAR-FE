import React, { useState, Fragment } from 'react';
import { Container, Grid, Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RainfallPlot from './rainfall_plot';
import SurficialPlot from './surficial_plot';
import SubsurfacePlot from './subsurface_plot';


const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    margin: {
        margin: theme.spacing(1),
    },
    menuContainer: {
        // marginTop: '40%'
    },
    menu: {
        width: '100%',
        marginRight: '5%'
    }
}));

function DataAnalysis() {
    const classes = useStyles();

    const [feature, setFeature] = useState([<RainfallPlot feature={"data_analysis"}/>]);
    const [rp, rpActive] = useState("primary");
    const [sfp, sfpActive] = useState("");
    const [sbp, sbpActive] = useState("");

    function handleFeatureNav(feature) {
        let return_feat = []
        switch (feature) {
            case "rainfall":
                rpActive("primary");
                sfpActive("");
                sbpActive("");
                return_feat = [<RainfallPlot feature={"data_analysis"} />];
                break;
            case "surficial":
                sfpActive("primary");
                rpActive("");
                sbpActive("");
                return_feat = [<SurficialPlot feature={"data_analysis"} />];
                break;
            case "subsurface":
                sfpActive("");
                rpActive("");
                sbpActive("primary");
                return_feat = [<SubsurfacePlot feature={"data_analysis"} />];
                break;
            default:
                rpActive("primary")
                sfpActive("");
                sbpActive("");
                return_feat = [<RainfallPlot feature={"data_analysis"} />];
                break;
        }
        setFeature(return_feat)
    }

    return (
        <Fragment>
            <Container maxWidth="xl" className={classes.root} spacing={24}>
                <Grid container alignItems="center" justify="center">
                    <Grid item xs={3}>
                        <Grid container direction="column" className={classes.menuContainer}>
                            <Grid item={true} xs={3} style={{ marginTop: '15%' }} />
                            <Grid item={true} xs={12} style={{ marginTop: '20%' }}>
                                <Fab variant="extended"
                                    color={rp}
                                    aria-label="add"
                                    className={classes.menu}
                                    onClick={()=>{handleFeatureNav("rainfall")}}>
                                    Rainfall Plot
                                </Fab>
                            </Grid>
                            <Grid item={true} xs={12} style={{ marginTop: '20%' }}>
                                <Fab variant="extended"
                                    color={sfp}
                                    aria-label="add"
                                    className={classes.menu}
                                    onClick={()=>{handleFeatureNav("surficial")}}>
                                    Surficial Plot
                                </Fab>
                            </Grid>
                            <Grid item={true} xs={12} style={{ marginTop: '20%' }}>
                                <Fab variant="extended"
                                    color={sbp}
                                    aria-label="add"
                                    className={classes.menu}
                                    onClick={()=>{handleFeatureNav("subsurface")}}>
                                    Subsurface Plot
                                </Fab>
                            </Grid>
                            <Grid item={true} xs={3} style={{ marginTop: '15%' }} />
                        </Grid> 
                    </Grid>
                    <Grid item xs={9} >
                        <div style={{overflow: 'auto', height: 650}}>
                            {feature}
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </Fragment>
    )
}

export default DataAnalysis