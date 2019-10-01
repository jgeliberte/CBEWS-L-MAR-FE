import React, { useState, Fragment } from 'react';
import { Container, Grid, Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HazardMapping from './hazard_mapping';
import CommunityRiskAssessment from './cra';
import CapacityAndVulnerability from './cav';


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

function CRA() {
    const classes = useStyles();

    const [feature, setFeature] = useState([<HazardMapping />]);
    const [hm, hmActive] = useState("primary");
    const [cra, crapActive] = useState("");
    const [cav, cavActive] = useState("");

    function handleFeatureNav(feature) {
        let return_feat = []
        switch (feature) {
            case "hazard_map":
                hmActive("primary");
                crapActive("");
                cavActive("");
                return_feat = [<HazardMapping />];
                break;
            case "c_r_a":
                hmActive("");
                crapActive("primary");
                cavActive("");
                return_feat = [<CommunityRiskAssessment />];
                break;
            case "c_a_v":
                hmActive("");
                crapActive("");
                cavActive("primary");
                return_feat = [<CapacityAndVulnerability />];
                break;
            default:
                hmActive("primary")
                crapActive("");
                cavActive("");
                return_feat = [<HazardMapping />];
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
                                    color={hm}
                                    aria-label="add"
                                    className={classes.menu}
                                    onClick={()=>{handleFeatureNav("hazard_map")}}>
                                    Hazard Mapping
                                </Fab>
                            </Grid>
                            <Grid item={true} xs={12} style={{ marginTop: '20%' }}>
                                <Fab variant="extended"
                                    color={cav}
                                    aria-label="add"
                                    className={classes.menu}
                                    onClick={()=>{handleFeatureNav("c_a_v")}}>
                                    Capacity and Vulnerability
                                </Fab>
                            </Grid>
                            <Grid item={true} xs={12} style={{ marginTop: '20%' }}>
                                <Fab variant="extended"
                                    color={cra}
                                    aria-label="add"
                                    className={classes.menu}
                                    onClick={()=>{handleFeatureNav("c_r_a")}}>
                                    Community risk assessment
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

export default CRA