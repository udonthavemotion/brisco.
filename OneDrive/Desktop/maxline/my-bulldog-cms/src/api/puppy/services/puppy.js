'use strict';

/**
 * puppy service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::puppy.puppy'); 