import React, {Fragment} from 'react';
import CustomGridList from '../reducers/grid_list'

import {
    Grid, Container,
    Fab, TextField, Button
} from "@material-ui/core";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

function CommunityRiskAssessment() {
    const cra_data = [{
        title: '<FILE_REPORT #1>',
        value: '../../path/file_name.ppt',
        sub_title: 'PPTX File'
    },
    {
        title: '<FILE_REPORT #2>',
        value: '../../path/file_name.docx',
        sub_title: 'DOCX File'
    },
    {
        title: '<FILE_REPORT #2>',
        value: '../../path/file_name.txt',
        sub_title: 'Txt File'
    },
    {
        title: '<FILE_REPORT #1>',
        value: '../../path/file_name.ppt',
        sub_title: 'PPTX File'
    },
    {
        title: '<FILE_REPORT #2>',
        value: '../../path/file_name.docx',
        sub_title: 'DOCX File'
    },
    {
        title: '<FILE_REPORT #2>',
        value: '../../path/file_name.txt',
        sub_title: 'Txt File'
    }]


    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    return (
        <Fragment>
            <Container align="center">
                <CustomGridList data={cra_data} />
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
                    />
                 </Grid>
                 <Grid item xs={2}>
                    <Fab variant="extended"
                        color={"primary"}
                        aria-label="add"
                        onClick={handleClickOpen}>
                        Browse
                    </Fab>
                 </Grid>
             </Grid>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={handleClose} color="primary">
                Confirm
            </Button>
            </DialogActions>
        </Dialog>
        </Fragment>
    )
}

export default CommunityRiskAssessment