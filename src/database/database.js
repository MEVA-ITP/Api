import mongoose from 'mongoose'
import {makeModels} from './models/index'
import {config} from '../config'

export const database = mongoose.createConnection(config.db.uri, {useNewUrlParser: true})
export const models = makeModels(database)