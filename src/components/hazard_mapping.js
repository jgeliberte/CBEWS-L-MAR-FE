import React, { Fragment } from 'react';
import Container from '@material-ui/core/Container';
import {Grid, Fab, TextField, 
    Button} from '@material-ui/core/';
import { useStyles } from '../styles/general_styles';
import ImageZoom from 'react-medium-image-zoom'

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const tileData = [
    {
        img: require('../assets/hazard_map1.jpg'),
        title: 'Dynaslope MAP (MAR)',
        featured: true,
    }
];

function HazardMapping() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    return (
        <Fragment>
            <Container className={classes.img_container}>
                <Grid container spacing={2} align="center">
                    {tileData.map(tile => (
                        <Grid item xs={12}>
                            <ImageZoom
                                image={{
                                src: tile.img,
                                alt: tile.title,
                                className: classes.img_container,
                                style: { width: '50em', zIndex: 1000 }
                                }}
                                zoomImage={{
                                src: tile.img,
                                alt: tile.title
                                }}
                            />

                        </Grid>
                    ))}
                    <Grid item={true} xs={12}>
                        <Fab variant="extended"
                            color={"primary"}
                            aria-label="add"
                            onClick={handleClickOpen}>
                            Upload map
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

export default HazardMapping