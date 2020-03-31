import React, { Fragment, useState, useEffect } from 'react';
import {
    Grid, Container,
    Fab, Typography, TextField, MenuItem
} from "@material-ui/core";
import { useStyles } from '../styles/general_styles';
import AppConfig from '../reducers/AppConfig';

function Events() {
    const [template_key, setKey] = useState('gndmeas');
    const [textArea, setTextArea] = useState([]);
    const [templates, setTemplates] = useState([]);
    const classes = useStyles();

    useEffect(()=> {
        initTemplates();
    },[]);

    const initTemplates = (site_code = "mar") => { 
        // Leave site code for now, in preparation for umi / mar merge
        let template_container = [];
        fetch(`${AppConfig.HOSTNAME}/api/events/template/fetch/all`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                responseJson.data.forEach(element => {
                    console.log(element);
                    template_container.push({
                        "ewi_id": element[0],
                        "tag": element[1],
                        "template": element[2],
                        "ts_modified": element[3],
                        "modified_by": element[4]
                    })
                });
                console.log(template_container);
                setTemplates(template_container);
            })
            .catch((error) => {
                console.log(error);
            }
        );
    }

    const handleChange = key_template => event => {
        console.log(event.target.value)
        setKey(event.target.value);
        setTextArea(
            <Fragment>
                <Grid container align="center">
                    <Grid item xs={12}>
                        <TextField
                            label="Template"
                            multiline={true}
                            rows={5}
                            fullWidth
                            rowsMax={10}
                        />
                    </Grid>
                    <Grid item xs={12} style={{marginTop: '10%'}}>
                        <Grid container>
                            <Grid item xs={4} />
                            <Grid item xs={4}>
                                <Fab variant="extended"
                                    color={"primary"}
                                    aria-label="add"
                                    className={classes.menu}
                                    onClick={()=>{}}>
                                    Save
                                </Fab>
                            </Grid>
                            <Grid item xs={4} />
                        </Grid>
                    </Grid>
                </Grid>
            </Fragment>

        )
    };

    return (
        <Fragment>
            <Container align="center">
                <Grid container>
                    <Grid item xs={12} className={classes.header}>
                        <Typography variant="h4">
                            Events | Message template creator
                        </Typography>
                    </Grid>
                    <Grid item xs={4} />
                    <Grid item xs={4}>
                        <TextField
                            id="standard-select-currency"
                            select
                            label="Message Template"
                            className={classes.textField}
                            value={template_key}
                            onChange={handleChange('template_key')}
                            SelectProps={{
                                MenuProps: {
                                    className: classes.menu,
                                },
                            }}
                            helperText="E.g. Ground Measurement Reminder"
                            margin="normal"
                        >

                        </TextField>
                        <Grid item xs={4} />
                        <Grid item xs={12}>
                            {textArea}
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Fragment>
    )
}

// {templates.map(option => (
//     <MenuItem key={option.value} value={option.value}>
//         {option.label}
//     </MenuItem>
// ))}

export default Events