import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { Schema } from './schema';
import * as config from '../webpack.config.dev.js';

const APP_PORT = 3000;
const GRAPHQL_PORT = 8080;
const compiler = webpack(config);
const ROOT_DIR = path.resolve(__dirname, '..');

/* *****************************************************************************
 *                             Database Endpoint                               *
 ******************************************************************************/

let graphQLServer = express();
graphQLServer.use('/', graphQLHTTP({
  graphiql: true,
  pretty: true,
  schema: Schema,
}));

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));


/* *****************************************************************************
 *                           App Endpoint                                      *
 ******************************************************************************/

let app = new WebpackDevServer(compiler, {
  contentBase: '/dist/',
  proxy: { '/graphql': `http://localhost:${GRAPHQL_PORT}` },
  publicPath: config.output.publicPath,
  noInfo: true,
  stats: { colors: true }
});
app.use(require('webpack-hot-middleware')(compiler)); // Hot loader
app.use('/', express.static(path.resolve(ROOT_DIR, 'dist'))); // Static server

app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});
