import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

export default class AppTitle extends Component {
    render() {
        return (
            <Grid container spacing={2} direction="column" alignContent="center">
                <Grid item>
                    <Paper style={{ textAlign: "center", marginTop: '3%' }} elevation={0}>
                        <Typography variant="h4" component="h3">
                            Community Based Early Warning Information for Landslides
                            </Typography>
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper style={{ textAlign: "center" }} elevation={0}>
                        <Typography variant="h5" component="h3">
                            Municipality of Leon, Barangay Marirong.
                            </Typography>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}
