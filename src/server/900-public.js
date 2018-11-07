import express from "express";
import path from "path";
import {config} from "../config";

export const init = (app) => {
    // Use the 'public' directory as serving directory for static/public content
    app.use('/', express.static(path.join(__dirname, config.paths.public)))
}