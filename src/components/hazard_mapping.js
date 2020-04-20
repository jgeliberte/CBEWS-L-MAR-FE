import React, { Fragment, useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import {
    Grid, Fab, TextField,
    Button, GridList, GridListTile, GridListTileBar, Input
} from '@material-ui/core/';
import { useStyles } from '../styles/general_styles';
import ImageZoom from 'react-medium-image-zoom'

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import AppConfig from '../reducers/AppConfig';

function HazardMapping() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [mapsContainer, setMapsContainer] = useState([]);
    const [mapPreview, setMapPreview] = useState([]);
    const [fileToUpload, setFileToUpload] = useState();
    const [filename, setFilename] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        initHazardMaps();
    }, [])

    const initHazardMaps = () => {
        fetch(`${AppConfig.HOSTNAME}/api/cra/hazard_maps/fetch/29`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                setMapsContainer(responseJson.data);
                handleMapPreview(responseJson.data[0]);
            })
            .catch((error) => {
                console.log(error);
            }
            );
    }


    const importAll = require =>
        require.keys().reduce((acc, next) => {
            acc[next.replace("./", "")] = require(next);
            return acc;
        }, {});

    const marirongMaps = importAll(
        require.context("../client-cbewsl/MARIRONG/MAPS", false, /\.(png|jpe?g|svg)$/)
    );

    const handleMapPreview = (map_data) => {
        let temp = {
            img: marirongMaps[map_data.filename],
            title: 'Dynaslope MAP (MAR)',
            featured: true,
        }
        setMapPreview([temp])
    }

    const handleFileSelection = event => {
        const file = event.target.files[0];
        setFileToUpload(file);
        setFilename(file.name);
    };

    const handleUpload = () => {
        const data = new FormData();
        data.append("file", fileToUpload);

        fetch(`${AppConfig.HOSTNAME}/api/cra/hazard_maps/upload`, {
            method: 'POST',
            body: data,
        }).then(response => response.json())
            .then(response => {
                if (response.status == true) {
                    handleClose();
                    setFileToUpload(null);
                    setFilename("");
                    alert("Successfully uploaded new hazard map")
                } else {
                    alert("Error uploading new hazard map")
                }
            })
            .catch(error => console.error(error));
    }

    return (
        <Fragment>
            <Container className={classes.img_container}>
                <Grid container spacing={2} align="center">
                    {
                        mapPreview.length != 0 ?
                            mapPreview.map(tile => (
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
                            ))
                            :
                            <div>
                            </div>
                    }
                    <Grid item={true} xs={12}>
                        <GridList className={classes.thumbnail} cols={2.5}>
                            {mapsContainer.map((tile) => (
                                <GridListTile key={tile.img} onClick={() => { handleMapPreview(tile) }}>
                                    <img src={marirongMaps[tile.filename]} alt={tile.filename} />
                                    <GridListTileBar
                                        title={tile.filename}
                                        classes={{
                                            root: classes.thumbnailTitle,
                                            title: classes.gridTitle,
                                        }}
                                    />
                                </GridListTile>
                            ))}
                        </GridList>
                    </Grid>
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
                                id="filename"
                                label="File path"
                                value={filename}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <input
                                accept="image/*"
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
                    <Button onClick={handleUpload} color="primary">
                        Confirm
            </Button>
                </DialogActions>
            </Dialog>
        </Fragment>

    )
}

export default HazardMapping