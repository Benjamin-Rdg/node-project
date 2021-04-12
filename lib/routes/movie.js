'use strict';

const Joi = require('joi')
const {query, payload} = require("@hapi/hapi/lib/validation");
const Movie = require('../models/movie.js')

module.exports = [
    {
        method: 'post',
        path: '/movie/add',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin']
            },
            validate: {
                payload: Joi.object({
                    title: Joi.string().min(2).max(96).example('La menace fantôme').description('Title of the film'),
                    description: Joi.string().min(1).max(500).example('Le film suit le chevalier Jedi Qui-Gon Jinn et son apprenti Obi-Wan Kenobi qui escortent et protègent la reine Amidala qui voyage de la planète Naboo à la planète Coruscant dans l\'espoir de trouver une issue pacifique à un différend commercial interplanétaire. Il met également en scène le jeune Anakin Skywalker avant qu\'il ne devienne un Jedi.').description('Description of the film'),
                    releaseDate: Joi.date().example('1990-02-10').description('Release date of the film'),
                    director: Joi.string().min(5).max(96).example('George Lucas').description('Director of the film'),
                })
            }
        },
        handler: async (request) => {
            const {movieService} = request.services();
            const {userService} = request.services();
            const {mailService} = request.services();
            const mails = await userService.getEmails();

            await mailService.movieAddTemplateMail(request.payload, mails);

            return await movieService.create(request.payload);
        }
    },
    {
        method: 'get',
        path: '/movie/list',
        options: {
            tags: ['api'],
            auth: {
                scope: ['user', 'admin']
            },
        },
        handler: async (request) => {
            const {movieService} = request.services();

            return await movieService.show();
        }
    },

    {
        method: 'post',
        path: '/movie/delete/{id}',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin']
            },
            validate: {
                payload: Joi.object({
                    id: Joi.number().integer().required().greater(0)
                })
            }
        },
        handler: async (request) => {
            const {movieService} = request.services();

            return await movieService.delete(request.payload);
        }
    },
    {
        method: 'patch',
        path: '/movie/{id}',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin']
            },
            validate: {
                payload: Joi.object({
                    id: Joi.number().integer().greater(0).required(),
                    title: Movie.field('title').tailor('patch').example('La menace fantôme').description('Title of the film'),
                    description: Movie.field('description').tailor('patch').example('Le film suit le chevalier Jedi Qui-Gon Jinn et son apprenti Obi-Wan Kenobi qui escortent et protègent la reine Amidala qui voyage de la planète Naboo à la planète Coruscant dans l\'espoir de trouver une issue pacifique à un différend commercial interplanétaire. Il met également en scène le jeune Anakin Skywalker avant qu\'il ne devienne un Jedi.').description('Description of the film'),
                    releaseDate: Movie.field('releaseDate').tailor('patch').example('1990-02-10').description('Release date of the film'),
                    director: Movie.field('director').tailor('patch').example('George Lucas').description('Director of the film'),
                })
            }
        },
        handler: async (request) => {
            const {userService} = request.services();
            const {movieService} = request.services();
            const {mailService} = request.services();
            const mails = await userService.getEmailsHavingMovieInFavorite(request.payload.id);

            await mailService.mailFilmUpdate(request.payload, mails);

            return await movieService.edit(request.payload);
        }
    },
]
