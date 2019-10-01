import React, {Fragment} from 'react';
import CustomGridList from '../reducers/grid_list'

import {
    Grid, Paper, Container,
    Fab, makeStyles
} from "@material-ui/core";

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
    return (
        <Fragment>
            <Container align="center">
                <CustomGridList data={cra_data} />
            </Container>
        </Fragment>
    )
}

export default CommunityRiskAssessment