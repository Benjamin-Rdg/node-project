'use strict';

const {Service} = require('@hapipal/schmervice');
const Boom = require('@hapi/boom')

module.exports = class FavoriteService extends Service {

    async create(favorite, userId) {
        const {Favorite} = this.server.models();
        favorite.userId = userId;

        const isAlreadyInFavorite = await Favorite.query()
            .where('userId', favorite.userId)
            .where('movieId', favorite.movieId)
            .skipUndefined();

        if (isAlreadyInFavorite.length !== 0) {
            return await Boom.conflict('You already add this movie to your favorite list choose an other one');
        }

        try {
            return Favorite.query().insertAndFetch(favorite);
        } catch (err) {
            console.warn('An error as occurred' + err);
            return await Boom.conflict('You are trying to add a movie that does not exist, try an other one \n' + err);
        }
    }

    async show(userId) {
        const {Favorite} = this.server.models();
        const {Movie} = this.server.models();

        return Movie.query().whereIn(
            'id',
            Favorite.query().select('movieId').where('userId', userId)
        );
    }

    async delete(favorite, userId) {
        const {Favorite} = this.server.models();

        try {
            return Favorite.query()
                .delete()
                .where('userId', userId)
                .where('movieId', favorite.movieId);
        } catch (err) {
            console.warn('An error as occurred' + err);
            return await Boom.conflict('You are trying to delete a movie in your favorite list but he is not inside, try an other one \n' + err);
        }
    }
}
