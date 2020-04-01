import React, { Fragment, useState, useEffect } from 'react';
import {
    Grid, Container,
    Fab, Typography, TextField, MenuItem
} from "@material-ui/core";
import { useStyles } from '../styles/general_styles';
import AppConfig from '../reducers/AppConfig';
import moment from 'moment';

function Events() {
    const [template_key, setKey] = useState('');
    const [textArea, setTextArea] = useState([]);
    const [templates, setTemplates] = useState([]);

    const [ewiID, setEwiId] = useState('');
    const [tag, setTag] = useState('');
    const [templateMessage, setTemplateMessage] = useState('');
    const [modifiedBy, setModifiedBy] = useState('');

    const [isNew, setIsNew] = useState(false);
    const [newTemplate, setNewTemplate] = useState([]);

    const classes = useStyles();
    const newTagOption = {
        'ewi_id': 0,
        'tag': '----NEW TEMPLATE----',
        'template': '',
        'ts_modified': '',
        'modified_by': ''
    }

    useEffect(()=> {
        initTemplates();
    },[ewiID]);

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
                    template_container.push({
                        "ewi_id": element[0],
                        "tag": element[1],
                        "template": element[2],
                        "ts_modified": element[3],
                        "modified_by": element[4]
                    })
                });
                template_container.push(newTagOption);
                setTemplates(template_container);
            })
            .catch((error) => {
                console.log(error);
            }
        );
    }

    const modifyTemplate = () => {
        let req_url = '';
        let method = '';
        if (isNew == true) {
            req_url = `${AppConfig.HOSTNAME}/api/events/template/add`;
            method = 'POST';
        } else {
            req_url = `${AppConfig.HOSTNAME}/api/events/template/update`;   
            method = 'PATCH';
        }
        // Leave modified_by: 1 for testing 
        fetch(req_url, {
            method: method,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "ewi_id": ewiID,
                "tag": tag,
                "template": templateMessage,
                "modified_by": 1
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == true) {
                    initTemplates();
                } else {
                    console.log("ERROR");
                }
            })
            .catch((error) => {
                console.error(error);
            }
        );
    }

    const resetStates = () => {
        setEwiId('');
        setTag('');
        setTemplateMessage('');
        setModifiedBy('');
    }

    const handleChange = key_template => event => {
        resetStates();
        setKey(event.target.value);
        let obj = templates.find(o => o.tag === event.target.value);
        let {ewi_id, tag, template, ts_modified, modified_by} = obj;
        let new_template_tag = [];
        
        if (ewi_id == 0) {
            setNewTemplate(
                <Grid container align="center" spacing={4} style={{paddingBottom: 10, paddingTop: 10}}>
                    <Grid item xs={12}>
                        <TextField
                            label="New template tag"
                            multiline={true}
                            onChange={(event)=> { setTag(event.target.value) }}
                            fullWidth
                            helperText="E.g. Meeting Invitation"
                        />
                    </Grid>
                </Grid>
            )
            setIsNew(true);
        } else {
            setNewTemplate([]);
            setIsNew(false);
        }

        setEwiId(ewi_id)
        setTag(tag)
        setTemplateMessage(template)
        setModifiedBy(modified_by)
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
                            id="ewi_template_id"
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
                        >
                        {templates.map(option => (
                            <MenuItem key={option.tag} value={option.tag}>
                                {option.tag}
                            </MenuItem>
                        ))}
                        </TextField>
                        <Grid item xs={4} />
                        <Grid item xs={12}>
                            {newTemplate}
                            <Grid container align="center">
                                <Grid item xs={12}>
                                    <TextField
                                        label="Template"
                                        multiline={true}
                                        onChange={(event)=> { setTemplateMessage(event.target.value)}}
                                        rows={5}
                                        fullWidth
                                        rowsMax={10}
                                        value={templateMessage}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} style={{marginTop: '10%'}}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={3} />
                                        <Grid item xs={3}>
                                            <Fab variant="extended"
                                                color={"primary"}
                                                aria-label="add"
                                                className={classes.menu}
                                                onClick={()=>{modifyTemplate()}}>
                                                { isNew ? "Add" : "Save"}
                                            </Fab>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Fab variant="extended"
                                                color={"primary"}
                                                aria-label="add"
                                                className={classes.menu}
                                                onClick={()=>{}}>
                                                Reset
                                            </Fab>
                                        </Grid>
                                        <Grid item xs={3} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Fragment>
    )
}

export default Events