'use strict';

const {Service} = require('@hapipal/schmervice');
const Boom = require('@hapi/boom')

module.exports = class MovieService extends Service {

    async create(movie) {
        const {Movie} = this.server.models();

        return Movie.query().insertAndFetch(movie);
    }

    async show() {
        const {Movie} = this.server.models();

        return Movie.query().select(
            'id', 'title', 'description', 'releaseDate', 'director'
        );
    }

    async delete(movie) {

        const {Movie} = this.server.models();

        try {
            return await Movie.query().deleteById(movie.id);
        } catch (err) {
            console.warn('An error as occurred' + err);

            return Boom.badRequest('An error as occurred' + err);
        }
    }

    async edit(movie) {
        const {Movie} = this.server.models();

        try {
            return await Movie.query().findById(movie.id).patch(movie);
        } catch (err) {
            return Boom.badImplementation('An error as occurred' + err);
        }
    }
}
