var getbabelRelayPlugin = require('babel-relay-plugin'),
    schema = require('../server/schema.json');

module.exports = getbabelRelayPlugin(schema.data);
