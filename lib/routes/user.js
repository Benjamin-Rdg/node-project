'use strict';

const Joi = require('joi')
const {query, payload} = require("@hapi/hapi/lib/validation");
const User = require('../models/user.js')

module.exports = [
    {
        method: 'post',
        path: '/user/add',
        options: {
            tags: ['api'],
            auth: false,
            validate: {
                payload: Joi.object({
                    firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                    lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
                    userName: Joi.string().min(3).max(32).example('Jojo').description('Username of the user'),
                    mail: Joi.string().required().min(5).max(48).example('exampleMail@gmail.com').description('Email of the use'),
                    password: Joi.string().required().min(8).max(64).description('Password of the user'),
                })
            }
        },
        handler: async (request) => {
            const {userService} = request.services();
            const {mailService} = request.services();

            await mailService.userAddTemplateMail(request.payload);

            return await userService.create(request.payload);
        }
    },
    {
        method: 'get',
        path: '/user/list',
        options: {
            tags: ['api'],
            auth: {
                scope: ['user', 'admin']
            },
        },
        handler: async (request) => {
            const {userService} = request.services();

            return await userService.show();
        }
    },
    {
        method: 'post',
        path: '/user/delete/{id}',
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
            const {userService} = request.services();

            return await userService.delete(request.payload);
        }
    },
    {
        method: 'patch',
        path: '/user/{id}',
        options: {
            tags: ['api'],
            auth: {
                scope: ['admin']
            },
            validate: {
                payload: Joi.object({
                    id: Joi.number().integer().required().greater(0),
                    firstName: User.field('firstName').tailor('patch').example('John').description('Firstname of the user'),
                    lastName: User.field('lastName').tailor('patch').example('Doe').description('Lastname of the user'),
                    userName: User.field('userName').tailor('patch').example('Jojo').description('Username of the user'),
                    mail: User.field('mail').tailor('patch').example('exampleMail@gmail.com').description('Email of the use'),
                    password: User.field('password').tailor('patch').description('Password of the user'),

                })
            }
        },
        handler: async (request) => {
            const {userService} = request.services();

            return await userService.edit(request.payload);
        }
    },
    {
        method: 'post',
        path: '/user/login',
        options: {
            tags: ['api'],
            auth: false,
            validate: {
                payload: Joi.object({
                    mail: Joi.string().min(5).max(48).example('exampleMail@gmail.com').description('Email of the use'),
                    password: Joi.string().min(8).max(64).description('Password of the user'),
                })
            }
        },
        handler: async (request) => {
            const {userService} = request.services();

            return await userService.login(request.payload);
        }
    }

]
