import mongoose from 'mongoose'
import {makeModels} from './models/index'
import {config} from '../config'

export const database = mongoose.createConnection(config.db.uri)
export const models = makeModels(database)