import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import { Schema } from './schema';
import * as config from '../utils/webpack.config.dev.js';

const isDeveloping = process.env.NODE_ENV !== 'production';
const APP_PORT = 8080;
const OUTPUT_DIR = path.join(__dirname, '..', 'dist');
var app = express();

if (isDeveloping) {
  // TODO: Set up development pipeline

  let compiler = webpack(config);

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(compiler));

  app.use('/graphql', graphQLHTTP({
    graphiql: true,
    pretty: true,
    schema: Schema,
  }));

  app.use(express.static(OUTPUT_DIR));

  app.listen(APP_PORT, () => {
    console.log(`Development server listening at http://localhost:${APP_PORT}`);
  });

} else {
  app.use('/graphql', graphQLHTTP({
    graphiql: true,
    pretty: true,
    schema: Schema,
  }));
  app.use(express.static(OUTPUT_DIR))
    .get('/', function(req, res) {
      res.sendFile('index.html', {
        root: path.resolve('..', 'dist')
      });
    })
    .listen(APP_PORT, () => {
      console.log(`App listening on port ${APP_PORT}`);
    });

}
