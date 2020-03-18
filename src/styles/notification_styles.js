import { makeStyles } from '@material-ui/core/styles';
const notificationStyle = makeStyles(theme => ({
    root: {
        width: '100%',
        '& > * + *': {
          marginTop: theme.spacing(2),
        },
      },
}));

export {notificationStyle};