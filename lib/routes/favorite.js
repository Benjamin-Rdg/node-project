'use strict';

const Joi = require('joi')

module.exports = [
    {
        method: 'post',
        path: '/favorite/add',
        options: {
            tags: ['api'],
            auth: {
                scope: ['user', 'admin']
            },
            validate: {
                payload: Joi.object({
                    movieId: Joi.number().integer().greater(0).required().example(1).description('id of the film')
                })
            }
        },
        handler: async (request) => {
            const {favoriteService} = request.services();

            return await favoriteService.create(request.payload, request.auth.credentials.userId);
        }
    },
    {
        method: 'get',
        path: '/favorite/list',
        options: {
            tags: ['api'],
            auth: {
                scope: ['user', 'admin']
            },
        },
        handler: async (request) => {
            const {favoriteService} = request.services();

            return await favoriteService.show(request.auth.credentials.userId);
        }
    },

    {
        method: 'post',
        path: '/favorite/delete/{id}',
        options: {
            tags: ['api'],
            auth: {
                scope: ['user', 'admin']
            },
            validate: {
                payload: Joi.object({
                    movieId: Joi.number().integer().greater(0).required().example(1).description('id of the film')
                })
            }
        },
        handler: async (request) => {
            const {favoriteService} = request.services();

            return await favoriteService.delete(request.payload, request.auth.credentials.userId);
        }
    },
]
