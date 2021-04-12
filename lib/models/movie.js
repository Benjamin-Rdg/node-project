'use strict';

const Joi = require('joi');
const {Model} = require('@hapipal/schwifty');

module.exports = class Movie extends Model {

    static get tableName() {

        return 'movie';
    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.number().integer().greater(0),
            title: Joi.string().min(2).max(96).example('La menace fantôme').description('Title of the film'),
            description: Joi.string().min(1).max(500).example('Le film suit le chevalier Jedi Qui-Gon Jinn et son apprenti Obi-Wan Kenobi qui escortent et protègent la reine Amidala qui voyage de la planète Naboo à la planète Coruscant dans l\'espoir de trouver une issue pacifique à un différend commercial interplanétaire. Il met également en scène le jeune Anakin Skywalker avant qu\'il ne devienne un Jedi. Celui-ci est alors un jeune esclave qui semble avoir une forte prédisposition à l\'utilisation de la Force.').description('Description of the film'),
            releaseDate: Joi.date().example('1990-02-10').description('Release date of the film'),
            director: Joi.string().min(5).max(96).example('George Lucas').description('Director of the film'),
            createdAt: Joi.date().description('Publication date of the film on the website'),
            updatedAt: Joi.date().description('Update date of the film on the website'),
        });
    }

    $beforeInsert(queryContext) {
        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate(opt, queryContext) {
        this.updatedAt = new Date();
    }
};
