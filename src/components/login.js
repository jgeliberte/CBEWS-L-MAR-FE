import React from 'react';
import { LogoCenter, AppTitle } from '../reducers/index';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom'

class Login extends React.Component {

    validateCredentials() {
        this.props.history.push(`/dashboard`);
    }
    
    render() {
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
                            onClick={() => { this.validateCredentials() }}>
                            Login
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}

export default withRouter(Login);