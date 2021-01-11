import adminUsers from '../adminUsers.json';

const isAdminUser = id => {
  return adminUsers.includes(id);
};

export default isAdminUser;
