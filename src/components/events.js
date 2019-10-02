import React, { Fragment, useState } from 'react';
import {
    Grid, Paper, Container,
    Fab, makeStyles, Box, Typography, TextField, MenuItem
} from "@material-ui/core";



const useStyles = makeStyles(theme => ({
    header: {
        margin: 50
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '100%',
    },
    dense: {
        marginTop: 19,
    },
    menu: {
        width: '100%',
    },
}));
export default function Events() {
    const [template, setTemplate] = useState([]);
    const [template_key, setKey] = useState('gndmeas');
    const [textArea, setTextArea] = useState([]);
    const classes = useStyles();
    const templates = [
        {
            value: 'gndmeas',
            label: 'Ground measurement reminder'
        },
        {
            value: 'ewi',
            label: 'Early Warning Information'
        },
        {
            value: 'rmm',
            label: 'Routine Monitoring Message'
        },
        {
            value: 'emm',
            label: 'Extended Monitoring Message'
        }
    ]

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
                            {templates.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
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