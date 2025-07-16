module.exports = async (policyContext, config, { strapi }) => {
  const { user } = policyContext.state;
  
  if (!user) {
    return false;
  }

  // For super admins, allow everything
  if (user.role && user.role.type === 'super-admin') {
    return true;
  }

  // Extract resource ID from params
  const resourceId = policyContext.params.id;
  
  if (!resourceId) {
    return false;
  }

  try {
    // Get the resource to check ownership
    const resource = await strapi.entityService.findOne(
      policyContext.route.info.apiName,
      resourceId,
      { populate: { createdBy: true } }
    );

    if (!resource) {
      return false;
    }

    // Check if user is the owner
    return resource.createdBy && resource.createdBy.id === user.id;
  } catch (error) {
    strapi.log.error('Error in isOwner policy:', error);
    return false;
  }
}; 