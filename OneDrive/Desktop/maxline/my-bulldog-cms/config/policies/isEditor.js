module.exports = async (policyContext, config, { strapi }) => {
  const { user } = policyContext.state;
  
  if (!user) {
    return false;
  }

  // Check if user has editor role or higher
  const allowedRoles = ['editor', 'admin', 'super-admin'];
  
  if (user.role && allowedRoles.includes(user.role.type)) {
    return true;
  }

  return false;
}; 