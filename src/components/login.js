import React, { Component } from 'react';
import {LogoCenter, AppTitle} from '../reducers/index';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
// import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class login extends Component {
    render() {
        return (
            <Container>
                <LogoCenter />
                <AppTitle />
                <Grid container direction="column" alignItems="center" justify="center">
                    <Grid item xs={3}>
                        <TextField
                            id="username"
                            label="Username"
                            placeholder="E.g. JuanDelaCruz"
                            margin="normal"
                            fullWidth
                            inputProps={{
                                style: { textAlign: "center" }
                            }}
                            InputLabelProps={{
                                style: {width: '100%', textAlign: 'center'}
                            }}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="password"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            margin="normal"
                            fullWidth
                            inputProps={{
                                style: { textAlign: "center" }
                            }}
                            InputLabelProps={{
                                style: {width: '100%', textAlign: 'center'}
                            }}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="contained"
                                color="primary"
                                size="large"
                                style={{margin: 20}}
                                >
                            Login
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}

export default login;