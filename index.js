var _ = require('lodash');
var SpotifyWebApi = require('spotify-web-api-node');

module.exports = {

    /**
     * Set acess token.
     *
     * @param dexter
     * @param spotifyApi
     */
    authParams: function (dexter, spotifyApi) {

        if (dexter.environment('spotify_access_token')) {

            spotifyApi.setAccessToken(dexter.environment('spotify_access_token'));
        }
    },

    /**
     * Set failure response.
     *
     * @param err
     * @param dexter
     */
    failureProcess: function (err, dexter) {

        var result = _.isArray(err)? err : [err];

        if (!dexter.environment('spotify_access_token')) {
            var envError = 'This module need optional environment variable [spotify_access_token];';

            result.unshift(envError);
        }

        return result;
    },

    /**
     * The main entry point for the Dexter module.
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {

        var spotifyApi = new SpotifyWebApi();

        this.authParams(dexter, spotifyApi);

        spotifyApi.followPlaylist(step.input('owner_id').first(), step.input('playlist_id').first(), _.pick(step.inputs(), 'public'))
            .then(function(data) {

                this.complete({});
            }.bind(this), function(err) {

                this.fail(this.failureProcess(err, dexter));
            }.bind(this));
    }
};
