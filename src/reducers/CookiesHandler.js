import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { useCookies } from 'react-cookie';

import { Link } from "react-router-dom";

function CookiesHandler() {
    const [cookies, setCookie] = useCookies(['credentials']);
    const [returnUI, setReturnUI] = useState([]);

    useEffect(()=> {
        checkCookies()
    },[])

    const checkCookies = () => {
        let temp = [];
        console.log(cookies);
        if (cookies.credentials == null) {
            temp.push(
                <Dialog
                    open={true}
                    disableBackdropClick={true}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"User session expired"}</DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Your login session has expired.
                    </DialogContentText>
                    <DialogContentText>
                        Re-login your account to regain access.
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button color="primary" autoFocus>
                        <Link to='/' > Redirect to login page </Link>
                    </Button>
                    </DialogActions>
                </Dialog>
            )
        } else {
            temp.push(<div></div>)
        }
        setReturnUI(temp);
    }

    return(
        <div>
            {returnUI}
        </div>
    )
}

export default CookiesHandler;