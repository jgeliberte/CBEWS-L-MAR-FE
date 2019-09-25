import React, { useState } from 'react';
import { Paper, Tabs, Tab, Box } from '@material-ui/core';
import Content from './body'

export default function TabsMenu() {
  const [value, setValue] = useState("home");
  const [body, setBody] = useState(<Content app_key={"home"} />);

  const handleChange = (event, app_module) => {
    let content = [<Content app_key={app_module} />]
    setValue(app_module);
    setBody(content)
  };

  return (
    <div>
      <Box style={{ paddingTop: 100, paddingBottom: 100 }}>
        <Paper square>
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            centered
          >
            <Tab value={"home"} label="Home" />
            <Tab value={"alertGen"} label="Alert Generation" />
            <Tab value={"dataAnalysis"} label="Data Analysis" />
            <Tab value={"sensorData"} label="Sensor Data" />
            <Tab value={"groundData"} label="Ground Data" />
            <Tab value={"events"} label="Events" />
            <Tab value={"maintenance"} label="Maintenance" />
          </Tabs>
        </Paper>
        {body}
      </Box>
    </div>
  );
}