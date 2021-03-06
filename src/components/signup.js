import React, {useState} from "react";
import {
	Avatar, Button, CssBaseline,
	TextField, Link, Grid, Box,
	Container
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from "@material-ui/core/styles";
import MomentUtils from '@date-io/moment';
import moment from "moment";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import AppConfig from "../reducers/AppConfig";

function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{"Copyright © "}
			<Link color="inherit" href="https://material-ui.com/">
				CBEWSL Iloilo
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center"
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(3)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	}
}));

const form_default = {
	lastname: "",
	firstname: "",
	nickname: "",
	mobile_number: "",
	birthdate: new Date(),
	username: "",
	password: "",
	email: "",
	site_id: AppConfig.CONFIG.site_id,
	site_code: AppConfig.CONFIG.site_code,
	is_complete_signup: true
};

export default function SignUp(props) {
	const classes = useStyles();
	
	const [formData, setFormData] = useState(form_default);
	const [notifStatus, setNotifStatus] = useState('success');
	const [openNotif, setOpenNotif] = useState(false);
	const [notifText, setNotifText] = useState('');

	const handleFormChanges = key => event => {
		let value = null;
		if (key === "birthdate") {
			value = event;
		} else value = event.target.value;
		setFormData({
			...formData,
			[key]: value
		});
	};

	const registerCredentials = () => {
		formData["birthdate"] = moment(formData["birthdate"]).format("YYYY-MM-DD");
		fetch(`${AppConfig.HOSTNAME}/api/accounts/signup`, {
			headers: { "Content-Type": "application/json; charset=utf-8" },
			method: 'POST',
			body: JSON.stringify(formData)
		})
		.then(response => response.json())
		.then((responseJson => {
			if (responseJson.status == true) {
				setOpenNotif(true);
				setNotifText('Successfully created an account. Pleases wait..');
				setTimeout(()=> {
					props.history.push(`/`);
				},3000)
			} else {
				setOpenNotif(true);
				setNotifStatus("error");
				setNotifText('Failed to create an account. Please review the signup form.');
			}
		}))
		.catch(error => {
			console.error(error);
		});
	};

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
				<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
				Sign up
				</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField
								autoComplete="fname"
								name="firstName"
								variant="outlined"
								required
								fullWidth
								id="firstName"
								label="First Name"
								autoFocus
								onChange={handleFormChanges("firstname")}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="lastName"
								label="Last Name"
								name="lastName"
								autoComplete="lname"
								onChange={handleFormChanges("lastname")}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="email"
								label="Email Address"
								name="email"
								autoComplete="email"
								onChange={handleFormChanges("email")}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="nickName"
								label="Nickname"
								name="nickName"
								autoComplete="nname"
								onChange={handleFormChanges("nickname")}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="mobileNumber"
								label="Mobile Number"
								name="mobileNumber"
								autoComplete="mnumber"
								onChange={handleFormChanges("mobile_number")}
							/>
						</Grid>
						<Grid item xs={12} sm={12}>
							<MuiPickersUtilsProvider utils={MomentUtils}>
								<KeyboardDatePicker
									inputVariant="outlined"
									margin="normal"
									id="birthdate"
									label="Your Birthday"
									format="MM-DD-YYYY"
									value={formData.birthdate}
									onChange={handleFormChanges("birthdate")}
									KeyboardButtonProps={{
										'aria-label': 'change date',
									}}
									fullWidth
								/>
							</MuiPickersUtilsProvider>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="username"
								label="Username"
								name="username"
								autoComplete="uname"
								onChange={handleFormChanges("username")}
							/>
						</Grid>
						<Grid item xs={6}>
							<TextField
								variant="outlined"
								required
								fullWidth
								name="password"
								label="Password"
								type="password"
								id="password"
								autoComplete="current-password"
								onChange={handleFormChanges("password")}
							/>
						</Grid>
					</Grid>
					<Button
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
						onClick={registerCredentials}
					>
						Sign Up
					</Button>
					<Grid container justify="flex-end">
						<Grid item>
						<Link href="#" variant="body2">
							Maybe you already have an account? Sign in
						</Link>
						</Grid>
					</Grid>
			</div>
			<Box mt={5}>
				<Copyright />
			</Box>
			<Snackbar open={openNotif} 
				autoHideDuration={3000} 
				onClose={() => {setOpenNotif(false)}}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				key={'top,right'}>
				<Alert onClose={() => {setOpenNotif(false)}} severity={notifStatus}>
					{notifText}
				</Alert>
			</Snackbar>
		</Container>
	);
}
