import React from 'react';
import {
    Grid, Paper, Container,
    Fab, makeStyles, Box, Typography
} from "@material-ui/core";
import { borderTop, borderBottom, borderColor, borderRadius } from '@material-ui/system';

const customGridStyle = makeStyles(theme => ({
    grid_container: {
        padding: 20
    },
    title: {
        color: "#17526d"
    }
}));

function CustomGridList(props) {
    const { data } = props;
    const classes = customGridStyle();
    let ret_val = [];
    data.forEach((item)=> {
        ret_val.push(
            <Grid item xs={12}>
                <Grid container className={classes.grid_container}>
                    <Grid item xs={12} >
                        <Box borderTop={2} borderRadius="10%" borderColor="#17526d">
                            <Typography variant="h4" className={classes.title}>
                                {item.title}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            {item.value}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Box borderBottom={2} borderRadius="10%" borderColor="#17526d">
                            <Typography variant="subtitle2">
                                {item.sub_title}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        )
    });

    return (<Grid container>{ret_val}</Grid>)
}

export default CustomGridList