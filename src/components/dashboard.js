import React from 'react';
import { Container, Paper, Grid } from '@material-ui/core';
import { Header, Footer, TabsMenu } from '../reducers/index';

export default function Dashboard() {
  return (
    <div>
      <Header />
      <TabsMenu/>
      <Footer />
    </div>
  );
}
