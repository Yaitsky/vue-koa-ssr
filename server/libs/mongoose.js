import mongoose from 'mongoose'
import beautifyUnique from 'mongoose-beautiful-unique-validation'
import config from '../config'

const debug = process.env.MONGOOSE_DEBUG || false

mongoose.Promise = Promise
if (debug) {
  mongoose.set('debug', true)
}
mongoose.connect(config.mongoose.uri, config.mongoose.options)
mongoose.plugin(beautifyUnique)

export default mongoose
