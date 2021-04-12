'use strict';

const Joi = require('joi');
const {Model} = require('@hapipal/schwifty');

module.exports = class User extends Model {

    static get tableName() {

        return 'user';
    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.number().integer().greater(0),
            firstName: Joi.string().min(3).max(32).example('John').description('Firstname of the user'),
            lastName: Joi.string().min(3).max(32).example('Doe').description('Lastname of the user'),
            userName: Joi.string().min(3).max(32).example('Jojo').description('Username of the user'),
            mail: Joi.string().min(5).max(48).example('exampleMail@gmail.com').description('Email of the user'),
            role: Joi.string().max(32).example('admin').description('Role of the user'),
            password: Joi.string().min(8).max(64).description('Password of the user'),
            createdAt: Joi.date().description('Publication date of the film on the website'),
            updatedAt: Joi.date().description('Update date of the film on the website'),
        });
    }

    $beforeInsert(queryContext) {
        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
        this.role = 'user'
    }

    $beforeUpdate(opt, queryContext) {
        this.updatedAt = new Date();
    }

};
