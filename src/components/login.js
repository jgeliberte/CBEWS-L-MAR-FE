import React, { useState, useRef, Fragment } from 'react';
import { LogoCenter, AppTitle } from '../reducers/index';
import { notificationStyle } from '../styles/notification_styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom'
import AppConfig from "../reducers/AppConfig";

function Login(props) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loginNotif, setLoginNotif] = useState(false);
    
    const loginSeverityRef = useRef();

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setLoginNotif(false);
    };

    const Alert = (props) => {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    const validateCredentials = () => {
        fetch(`${AppConfig.HOSTNAME}/api/accounts/signin`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == true) {
                    loginSeverityRef.current = (<Alert onClose={handleClose} severity="success">{ responseJson.message }</Alert>)
                    props.history.push(`/dashboard`);
                } else {
                    loginSeverityRef.current = (<Alert onClose={handleClose} severity="error">{ responseJson.message }</Alert>)
                }
                setLoginNotif(true)

            })
            .catch((error) => {
                console.error(error);
            }
        );
    }

    const signupNewUser = () => {
        props.history.push(`/signup`);
    }

    return (
        <Fragment>
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
                            onChange={(e) => { setUsername(e.target.value) }}
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
                            onChange={(e) => { setPassword(e.target.value) }}
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
            <Snackbar open={loginNotif} autoHideDuration={3000} onClose={handleClose}>
                {loginSeverityRef.current}
            </Snackbar>
        </Fragment>
    );
}

export default withRouter(Login);