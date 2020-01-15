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
    alert_level: {
        color: '#f09e01'
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