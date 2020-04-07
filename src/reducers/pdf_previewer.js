import React from 'react';
import { renderToString } from 'react-dom/server';
import { Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const imageStyle = makeStyles(theme => ({
    img_size: {
        height: '100%',
        width: '100%'
    },
    summary_content: {
        minHeight: 500
    }
}));

const summaryStyle = makeStyles(theme => ({
    content: {
        minHeight: getWindowDimensions().height * 0.415,
        maxHeight: getWindowDimensions().height * 0.415
    }
}));

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

function PDFPreviewer(props) {
    const img = imageStyle();
    const summary = summaryStyle();
    const { data } = props;

    console.log(data);
    const html = renderToString(data);

    return (
        <Paper>
            <Grid item xs={12}>
                <img src={require('../assets/letter_header.png')} className={img.img_size} alt="footer" />
            </Grid>
            <Grid item xs={12} className={summary.content}>
                Content
                {data}
            </Grid>
            <Grid item xs={12}>
                <img src={require('../assets/letter_footer.png')} className={img.img_size} alt="footer" />
            </Grid>
        </Paper>
    );
}

export default PDFPreviewer;