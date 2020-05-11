import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    margin: {
        margin: theme.spacing(1),
    },
    menu_functions: {
        paddingTop: '10%'
    },
    menu: {
        width: '100%',
        marginRight: '5%'
    },
    button_fluid: {
        width: '90%',
        padding: 10
    },
    info_padding: {
        padding: 20
    },
    label_paddings: {
        padding: 10
    },
    alert_level_0: {
        color: 'green'
    },
    alert_level_1: {
        color: 'blue'
    },
    alert_level_2: {
        color: '#f09e01'
    },
    alert_level_3: {
        color: 'red'
    },
    header: {
        margin: 50
    },
    
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    img_container: {
        heigth: '80%',
        width: '80%',
        zIndex: 1000
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '100%',
    },
    thumbnail : {
        flexWrap: 'nowrap',
        transform: 'translateZ(0)',
    },
    gridTitle: {
        color: '#fffffff',
      },
    thumbnailTitle: {
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
    },

    fabGreen: {
        background: 'green',
        color: 'white',
        fontWeight: 'bold'
    },
    fabRed: {
        background: 'red',
        color: 'black',
        fontWeight: 'bold'
    },

    releaseEwiButton: {
        height: '130%'
    }
}));

const tableStyle = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    },
}));

export {useStyles, tableStyle};