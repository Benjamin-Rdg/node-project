'use strict';

const {Service} = require('@hapipal/schmervice');
const Encrypt = require('br-encrypt')
const Boom = require('@hapi/boom')
const Jwt = require('@hapi/jwt');

module.exports = class UserService extends Service {

    SECRET_KEY = 'mySecretKey';

    async create(user) {
        const {User} = this.server.models();
        const encrypt = new Encrypt(this.SECRET_KEY);

        user.password = encrypt.encryptPassword(user.password);

        return User.query().insertAndFetch(user);
    }

    async show() {
        const {User} = this.server.models();

        return User.query().select(
            'id', 'firstName', 'lastName', 'userName', 'mail'
        );
    }


    async delete(user) {
        const {User} = this.server.models();

        try {
            return await User.query().deleteById(user.id);
        } catch (err) {
            console.warn('An error as occurred' + err);

            return Boom.badRequest('An error as occurred' + err);
        }
    }

    async edit(user) {
        const {User} = this.server.models();
        const encrypt = new Encrypt(this.SECRET_KEY);

        try {
            if (user.password) {
                user.password = encrypt.encryptPassword(user.password);
            }

            return await User.query().findById(user.id).patch(user);
        } catch (err) {
            return Boom.badImplementation('An error as occurred' + err);
        }
    }

    async login(user) {
        const {User} = this.server.models();
        const encrypt = new Encrypt(this.SECRET_KEY)

        try {
            const userInRepository = await User.query().findOne({mail: user.mail,});

            if (!userInRepository) {
                return await Boom.unauthorized('This email doesn\'t exist in our database, please retry');
            }
            if (!encrypt.validatePassword(user.password, userInRepository.password)) {
                return await Boom.unauthorized('Your password do not correspond');
            }

            return Jwt.token.generate(
                {
                    aud: 'urn:audience:iut',
                    iss: 'urn:issuer:iut',
                    userId: userInRepository.id,
                    firstName: userInRepository.firstName,
                    lastName: userInRepository.lastName,
                    mail: userInRepository.mail,
                    scope: userInRepository.role,
                },
                {
                    key: 'mySecretKey',
                    algorithm: 'HS512'
                },
                {
                    ttlSec: 14400 // 4 hours
                }
            );
        } catch (err) {
            return Boom.badImplementation('An error as occurred' + err);
        }
    }

    async getEmails() {
        const {User} = this.server.models();

        return User.query().select('mail');
    }

    async getEmailsHavingMovieInFavorite(movieId) {
        const {User} = this.server.models();
        const {Favorite} = this.server.models();

        return User.query().select('mail').whereIn(
            'id',
            Favorite.query().select('userId').where('movieId', movieId)
        );
    }
}
