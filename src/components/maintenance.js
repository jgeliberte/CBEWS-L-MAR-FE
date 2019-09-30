import React, { useState, Fragment } from 'react';
import { Container, Grid, Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MaintenanceLogs from './maintenance_logs';
import IncidentReports from './incident_reports';

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


function Maintenance() {

    const [feature, setFeature] = useState([<MaintenanceLogs />]);
    const [av, avActive] = useState("");
    const [lca, lcaActive] = useState("primary");

    function handleFeatureNav(feature) {
        let return_feat = []
        switch (feature) {
            case "incident_reports":
                lcaActive("")
                avActive("primary");
                return_feat = [<IncidentReports />]
                break;
            case "maintenance_logs":
                lcaActive("primary")
                avActive("");
                return_feat = [<MaintenanceLogs />]
                break;
            default:
                lcaActive("primary")
                avActive("");
                return_feat = [<MaintenanceLogs />]
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
                            <Grid item={true} xs={3} style={{ marginTop: '15%' }} />
                            <Grid item={true} xs={12} style={{ marginTop: '25%' }}>
                                <Fab variant="extended"
                                    color={lca}
                                    aria-label="add"
                                    className={classes.menu}
                                    onClick={() => { handleFeatureNav("maintenance_logs") }}>
                                    Maintenance Logs
                                </Fab>
                            </Grid>
                            <Grid item={true} xs={12} style={{ marginTop: '25%' }}>
                                <Fab variant="extended"
                                    color={av}
                                    aria-label="add"
                                    className={classes.menu}
                                    onClick={() => { handleFeatureNav("incident_reports") }}>
                                    Incident Reports
                                </Fab>
                            </Grid>
                            <Grid item={true} xs={3} style={{ marginTop: '15%' }} />
                        </Grid>
                    </Grid>
                    <Grid item xs={9} >
                    <div style={{overflow: 'auto', height: 660}}>
                        {feature}
                    </div>
                    </Grid>
                </Grid>
            </Container>
        </Fragment>
    )
}

export default Maintenance