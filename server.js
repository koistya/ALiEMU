import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server'; // FIXME: remove once hotloading is figured out
import { Schema } from './server/schema';
import * as config from './webpack.config.js';

const APP_PORT = 3000;
const GRAPHQL_PORT = 8080;

// Expose a GraphQL endpoint
var graphQLServer = express();
graphQLServer.use('/', graphQLHTTP({
  graphiql: true,
  pretty: true,
  schema: Schema,
}));

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));

let compiler = webpack(config);

// let appl = express();
//
// appl.use(require('webpack-dev-middleware')(compiler, {
//     contentBase: '/dist/',
//     noInfo: true,
//     stats: { colors: true },
//     publicPath: config.output.publicPath,
//     proxy: { '/graphql': `http://localhost:${GRAPHQL_PORT}` },
//   }
// ));

// appl.use(require('webpack-hot-middleware')(compiler));
//
// appl.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });
// appl.use('/', express.static(path.resolve(__dirname, 'dist')));
//
// appl.listen(APP_PORT, () => {
//   console.log(`App is now running on http://localhost:${APP_PORT}`);
// });



let app = new WebpackDevServer(compiler, {
  contentBase: '/dist/',
  proxy: { '/graphql': `http://localhost:${GRAPHQL_PORT}` },
  publicPath: config.output.publicPath,
  noInfo: true,
  stats: { colors: true }
});
// Serve static resources
app.use('/', express.static(path.resolve(__dirname, 'dist')));
app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});
