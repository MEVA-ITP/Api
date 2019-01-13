import mongoose from 'mongoose'
import {config} from '../general/config'

export const database = mongoose.createConnection(config.get('db.uri'), config.get('db.options'))