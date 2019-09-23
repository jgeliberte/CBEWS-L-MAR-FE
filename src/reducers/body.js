import React from 'react'
import {
    AlertGeneration,
    DataAnalysis,
    Events,
    GroundData,
    SensorData,
    Maintenance
} from '../components/menu'

function handleContent(app_key) {
    let body_content = []
    switch (app_key) {
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
        default:
            body_content = [<AlertGeneration />]
            break;
    }
    return body_content
}

function Content({app_key}) {
    let content = handleContent(app_key)
    return (
        content
    )
}

export default Content