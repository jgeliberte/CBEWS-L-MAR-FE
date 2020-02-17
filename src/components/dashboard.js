import React from 'react';
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
