import React from 'react';
import { LogoCenter, AppTitle } from '../reducers/index';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import { withRouter } from 'react-router-dom'


function Login (props) {
    const validateCredentials = () => {
        props.history.push(`/dashboard`);
    }

    const signupNewUser = () => {
        props.history.push(`/signup`);
    }

    return (
        <Container>
            <LogoCenter />
            <AppTitle />
            <Grid container alignItems="center" justify="center">
                <Grid item xs={4}>
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
                            style: { width: '100%', textAlign: 'center' }
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container alignItems="center" justify="center">
                <Grid item xs={4}>
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
                            style: { width: '100%', textAlign: 'center' }
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container alignItems="center" justify="center">
                <Grid item xs={4} align="center">
                    <Button variant="contained"
                        color="primary"
                        size="large"
                        style={{ margin: 20 }}
                        onClick={() => { validateCredentials() }}>
                        Login
                    </Button>
                </Grid>
            </Grid>
            <Grid container alignItems="center" justify="center" spacing={1}>
                <Grid item xs={12} align="center">
                    <Link 
                        onClick={() => signupNewUser()}>
                        Sign-Up
                    </Link>
                </Grid>
                <Grid item xs={12} align="center">
                    <Link to="#">Forgot password</Link>
                </Grid>
            </Grid>
        </Container>
    );
}

export default withRouter(Login);