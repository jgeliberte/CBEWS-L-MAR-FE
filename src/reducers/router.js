import React from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from '../components/login'
import Dashboard from '../components/dashboard'

function RouterApp() {
    return (
        <Router>
            <Switch>
                <Route path="/dashboard" component={Dashboard} />
                <Route exact path="/login" component={Login} />
                <Route render={
                    () => <h3> Page not found</h3>
                } />
            </Switch>
        </Router>
    )
}

export default RouterApp