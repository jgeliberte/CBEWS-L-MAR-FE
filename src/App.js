import React, { Component } from 'react'
import Dashboard from '../src/components/dashboard'
import Login from '../src/components/login'
import { BrowserRouter, withRouter } from 'react-router-dom';
import RouterApp from '../src/reducers/router'

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <RouterApp />
            </BrowserRouter>
        )
    }
}

export default App;
