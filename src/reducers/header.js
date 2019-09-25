import React from 'react';
import { LogoAppBar } from '../reducers/index'
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';


export default function Header() {
    return (
        <AppBar position="fixed" color="inherit">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <LogoAppBar />
            </Toolbar>
        </AppBar>
    );
}

;