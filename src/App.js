import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom';
import RouterApp from '../src/reducers/router';
import { CookiesProvider } from 'react-cookie';

class App extends Component {
    render() {
        return (
            <CookiesProvider>
                <BrowserRouter>
                    <RouterApp />
                </BrowserRouter>
            </CookiesProvider>
        )
    }
}

export default App;
