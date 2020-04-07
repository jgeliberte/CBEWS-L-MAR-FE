import React from 'react';
import { AppBar, Typography, Container, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    appBar: {
        top: 'auto',
        bottom: 0,
        padding: 5,
        alignItems: 'center'
    },
    contactDetails: {
        flexGrow: 1,
        textAlign: 'center'
    }
}));

function Footer() {
    const classes = useStyles();
    return (
        <AppBar position="fixed" color="inherit" className={classes.appBar}>
            <Container>
                <Grid container spacing={0} justify="center">
                    <Grid item xs={12}>
                        <Typography variant="h6" className={classes.contactDetails}>
                            Email: pdrrmo@gmail.com
                        </Typography>
                        <Typography variant="h6" className={classes.contactDetails}>
                            Hotline: 09123456789
                        </Typography>
                    </Grid>
                </Grid>
                
            </Container>
        </AppBar>
    )
}

export default Footer 