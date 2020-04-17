import React from 'react'
import {
    AlertGeneration,
    DataAnalysis,
    Events,
    GroundData,
    SensorData,
    Maintenance,
    Home,
    CRA
} from '../components/menu'
import CookiesHandler from '../reducers/CookiesHandler';

function handleContent(app_key) {
    let body_content = []
    switch (app_key) {
        case "cra":
            body_content = [<CRA />]
            break;
        case "alertGen":
            body_content = [<AlertGeneration />]
            break;
        case "dataAnalysis":
            body_content = [<DataAnalysis />]
            break;
        case "sensorData":
            body_content = [<SensorData />]
            break;
        case "groundData":
            body_content = [<GroundData />]
            break;
        case "events":
            body_content = [<Events />]
            break;
        case "maintenance":
            body_content = [<Maintenance />]
            break;
        case "home":
            body_content = [<Home />]
            break;
        default:
            body_content = [<Home />]
            break;
    }
    return body_content
}

function Content({app_key}) {
    let content = handleContent(app_key)
    return (
        <div>
            <CookiesHandler />
            {content}
        </div>
    )
}

export default Content