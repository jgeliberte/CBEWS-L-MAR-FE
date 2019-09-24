import React, { useState, Fragment } from 'react';
import { Container, Grid, Fab, GridList, GridListTile } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AlertValidation, LatestCurrentAlert } from './alert_generation_feature'


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


function AlertGeneration() {

    const [feature, setFeature] = useState(<LatestCurrentAlert />);
    const [av, avActive] = useState("");
    const [lca, lcaActive] = useState("primary");

    function handleFeatureNav(feature) {
        let return_feat = []
        switch (feature) {
            case "alert_validation":
                lcaActive("")
                avActive("primary");
                return_feat = <AlertValidation />
                break;
            case "latest_current_alert":
                lcaActive("primary")
                avActive("");
                return_feat = <LatestCurrentAlert />
                break;
            default:
                lcaActive("primary")
                avActive("");
                return_feat = <LatestCurrentAlert />
                break;
        }
        setFeature(return_feat)
    }

    const classes = useStyles();
    return (
        <Fragment>
            <Container maxWidth="xl" className={classes.root} spacing={24}>
                <Grid container alignItems="center" justify="center">
                    <Grid item xs={3} >
                        <Grid container direction="column" className={classes.menuContainer}>
                            <Grid item={true} xs={3} style={{ marginTop: '30%' }} />
                            <Grid item={true} xs={12} style={{ marginTop: '25%' }}>
                                <Fab variant="extended"
                                    color={lca}
                                    aria-label="add"
                                    className={classes.menu}
                                    onClick={() => { handleFeatureNav("latest_current_alert") }}>
                                    Latest Current Alert
                                </Fab>
                            </Grid>
                            <Grid item={true} xs={12} style={{ marginTop: '25%' }}>
                                <Fab variant="extended"
                                    color={av}
                                    aria-label="add"
                                    className={classes.menu}
                                    onClick={() => { handleFeatureNav("alert_validation") }}>
                                    Alert Validation
                                </Fab>
                            </Grid>
                            <Grid item={true} xs={3} style={{ marginTop: '30%' }} />
                        </Grid>
                    </Grid>
                    <Grid item xs={9} >
                        {feature}
                    </Grid>
                </Grid>
            </Container>
        </Fragment>
    )
}

export default AlertGeneration