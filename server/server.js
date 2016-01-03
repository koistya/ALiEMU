import express from 'express';
import graffiti from '@risingstack/graffiti';
import { getSchema } from '@risingstack/graffiti-mongoose';
import mongoose from 'mongoose';
import Schema from './schema';
import path from 'path';
import webpack from 'webpack';
import * as config from '../utils/webpack.config.dev';
import _ from 'lodash';
import Faker from 'faker';
// import graphQLHTTP from 'express-graphql';

const isDevelopment = process.env.NODE_ENV !== 'production';
const APP_PORT = process.env.PORT || 8080;
const MONGO_ADDR = process.env.AU2_MONGODB_1_PORT_27017_TCP_ADDR || null;
const MONGO_PORT = process.env.AU2_MONGODB_1_PORT_27017_TCP_PORT || null;
const MONGO_URI = MONGO_ADDR ? `mongodb://${MONGO_ADDR}:${MONGO_PORT}/graphql`
                             : 'mongodb://localhost/graphql';
const OUTPUT_DIR = path.resolve(__dirname, '..', 'dist');
const app = express();

mongoose.connect(MONGO_URI);

const User = mongoose.model('User');
const Widget = mongoose.model('Widget');

// var user = new User({ name: Faker.name.findName(), widgets: [] });
User.create({ name: Faker.name.findName(), widgets: [] });

var widgetArr = [];
_.times(10, () => {
  widgetArr.push({ name: Faker.hacker.phrase() });
});

Widget.create(...widgetArr, function(err) {
  if (err) {
    throw err;
  }
});

if (isDevelopment) {

  let compiler = webpack(config);

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(compiler));

  app.use(graffiti.express({
    schema: getSchema(Schema)
  }));

  app.use(express.static(OUTPUT_DIR));

  app.listen(APP_PORT, () => {
    console.log(`Development server listening at http://localhost:${APP_PORT}`);
  });

} else {

  app.use(graffiti.express({
    schema: getSchema(Schema)
  }));
  app.use(express.static(OUTPUT_DIR));
  app.listen(APP_PORT, () => {
    console.log(`Production server listening at http://localhost:${APP_PORT}`);
  });

}



// app.use('/graphql', graphQLHTTP({
//   graphiql: true,
//   pretty: true,
//   schema: Schema,
// }));
// app.use(express.static(OUTPUT_DIR))
//   .get('/', function(req, res) {
//     res.sendFile('index.html', {
//       root: path.resolve('..', 'dist')
//     });
//   })
//   .listen(APP_PORT, () => {
//     console.log(`App listening on port ${APP_PORT}`);
//   });
