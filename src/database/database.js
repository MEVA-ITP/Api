import mongoose from 'mongoose'
import {config} from '../config/defaultConfig'

export const database = mongoose.createConnection(config.db.uri, config.db.options)