import React, {Fragment, useEffect, useState} from 'react';
import CustomGridList from '../reducers/grid_list'
import {
    Grid, Container,
    Fab, TextField, Button
} from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Input from '@material-ui/core/Input';
import Helpers from '../Helpers';
import AppConfig from "../reducers/AppConfig";

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function renameFileType(type) {
    const file_types = {
        "txt": "Text",
        "pdf": "PDF",
        "ppt": "PowerPoint Presentation",
        "pptx": "PowerPoint Presentation",
        "doc": "Document",
        "docx": "Document"
    };
    const return_type = file_types[type];
    return typeof return_type !== "undefined" ? return_type : "Unknown"
}

function formatCRAData (data) {
    return data.map(cra => ({
        title: cra.filename,
        value: cra.file_path,
        sub_title: `${renameFileType(cra.file_type)} File`
    }))
}

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function CommunityRiskAssessment(props) {
    const { classes } = props;
    const [open, setOpen] = useState(false);
    const [cra_data, setCraData] = useState([]);
    const [file_to_upload, setFileToUpload] = useState(null);
    const [filename, setFilename] = useState("");
    
    const [notifStatus, setNotifStatus] = useState('success');
	const [openNotif, setOpenNotif] = useState(false);
	const [notifText, setNotifText] = useState('');

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const handleFileSelection = event => {
        const file = event.target.files[0];
        setFileToUpload(file);
        setFilename(file.name);
    };

    const handleClickUpload = () => {
        const data = new FormData();
        data.append("file", file_to_upload);

        fetch(`${AppConfig.HOSTNAME}/api/cra/community_risk_assessment/upload`, {
            method: 'POST',
            body: data,
        }).then((response) => {
            if (response.ok) {
                handleClose();
                setFileToUpload(null);
                setOpenNotif(true);
                setNotifStatus("success");
                setNotifText("Successfully uploaded new community risk assessment file.");
            } else {
                setOpenNotif(true);
                setNotifStatus("error");
                setNotifText("Error uploading community risk assessment file.");
            }
        })
        .catch(error => console.error(error));
    };

    const handleDelete = path => () =>  {
        console.log("Clicked Delete! This is a pending function.")
    }

    useEffect(() => {
        Helpers.httpRequest(
            `${AppConfig.HOSTNAME}/api/cra/community_risk_assessment/fetch`,
            "POST",
            { path: `${AppConfig.MARIRONG_DIR}/DOCUMENTS`},
        )
        .then(response => formatCRAData(response.data))
        .then(finalizedCRA => {
            setCraData(finalizedCRA);
        })
        .catch(error => console.error(error));
    }, [file_to_upload]);

    return (
        <Fragment>
            <Container align="center">
                <CustomGridList 
                    data={cra_data}
                    type="cra_list"
                    // handleDownload={Helpers.downloadBlob}
                    handleDownload={handleDelete}
                    handleDelete={handleDelete} 
                />
                <Grid container>
                    <Grid item xs={12}>
                        <Fab variant="extended"
                            color={"primary"}
                            aria-label="add"
                            onClick={handleClickOpen}>
                            Upload CRA
                        </Fab>
                    </Grid>
                </Grid>
            </Container>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">File upload</DialogTitle>
            <DialogContent>
             <Grid container>
                 <Grid item xs={8}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="File path"
                        type="email"
                        fullWidth
                        value={filename}
                    />
                 </Grid>
                 <Grid item xs={2}>
                 <input
                    accept="*"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    multiple
                    type="file"
                    onChange={handleFileSelection}
                    />
                    <label htmlFor="raised-button-file">
                        <Button variant="raised" component="span" color="primary">
                            Browse
                        </Button>
                    </label>
                 </Grid>
             </Grid>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button
                onClick={handleClickUpload}
                color="primary">
                Upload
            </Button>
            </DialogActions>
        </Dialog>
        <Snackbar open={openNotif} 
            autoHideDuration={3000} 
            onClose={() => {setOpenNotif(false)}}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            key={'top,right'}>
            <Alert onClose={() => {setOpenNotif(false)}} severity={notifStatus}>
                {notifText}
            </Alert>
        </Snackbar>
        </Fragment>
    )
}

export default CommunityRiskAssessment
