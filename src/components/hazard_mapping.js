import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Grid, Fab} from '@material-ui/core/';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';

const useStyles = makeStyles(theme => ({
    img_container: {
        heigth: '80%',
        width: '80%'
    }
}));


const tileData = [
    {
        img: require('../assets/hazard_map1.jpg'),
        title: 'Dynaslope MAP (UMI)',
        featured: true,
    }
];

function HazardMapping() {
    const classes = useStyles();

    return (
        <Fragment>
            <Container className={classes.img_container}>
                <Grid container spacing={2} align="center">
                    {tileData.map(tile => (
                        <Grid item xs={12}>
                            <img src={tile.img} className={classes.img_container} alt={tile.title} />
                        </Grid>
                    ))}
                    <Grid item={true} xs={12}>
                        <Fab variant="extended"
                            color={"primary"}
                            aria-label="add"
                            onClick={()=>{}}>
                            Upload map
                        </Fab>
                    </Grid>
                </Grid>
            </Container>
        </Fragment>

    )
}

export default HazardMapping