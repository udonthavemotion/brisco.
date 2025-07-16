// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: any }) {
    try {
      const publicRole = await strapi.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
      if (!publicRole) {
        console.log('Public role not found. Skipping permissions setup.');
        return;
      }

      const permissionQuery = strapi.query('plugin::users-permissions.permission');

      // Define the actions to enable (REST API)
      const restActions = [
        'api::puppy.puppy.find',
        'api::puppy.puppy.findOne',
        'api::stud.stud.find',
        'api::stud.stud.findOne'
      ];

      // Define GraphQL actions to enable
      const graphqlActions = [
        'api::puppy.puppy.find',
        'api::puppy.puppy.findOne',
        'api::stud.stud.find',
        'api::stud.stud.findOne'
      ];

      const actions = [...restActions, ...graphqlActions];

      // Enable each permission individually
      for (const action of actions) {
        const existingPermission = await permissionQuery.findOne({
          where: { action, role: publicRole.id }
        });

        if (existingPermission) {
          await permissionQuery.update({
            where: { id: existingPermission.id },
            data: { enabled: true }
          });
        }
      }
      
      console.log('Public permissions set for Puppy and Stud APIs.');
    } catch (error) {
      console.error('Error setting permissions in bootstrap:', error);
    }
  },
};
