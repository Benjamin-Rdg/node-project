'use strict';

module.exports = {

    async up(knex) {

        await knex.schema.createTable('favorite', (table) => {
            table.increments('id').notNullable().primary();
            table.integer('userId').notNullable();
            table.integer('movieId').notNullable();
        });
    },

    async down(knex) {

        await knex.schema.dropTableIfExists('favorite');
    }
};
