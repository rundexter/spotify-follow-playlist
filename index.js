var _ = require('lodash'),
    util = require('./util.js'),
    SpotifyWebApi = require('spotify-web-api-node');

var pickInputs = {
    'owner_id': {key: 'owner_id', validate: { req: true } },
    'playlist_id': {key: 'playlist_id', validate: { req: true } },
    'public': { key: 'ids', type: 'boolean' }
};

module.exports = {
    /**
     * The main entry point for the Dexter module.
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var spotifyApi = new SpotifyWebApi(),
            token = dexter.provider('spotify').credentials('access_token'),
            inputs = util.pickInputs(step, pickInputs),
            validateErrors = util.checkValidateErrors(inputs, pickInputs);

        if (validateErrors)
            return this.fail(validateErrors);

        spotifyApi.setAccessToken(token);
        spotifyApi.followPlaylist(inputs.owner_id, inputs.playlist_id, _.get(inputs, 'public'))
            .then(function() {
                this.complete({});
            }.bind(this), function(err) {
                this.fail(err);
            }.bind(this));
    }
};
