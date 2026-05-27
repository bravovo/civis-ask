const validRoles = ["civis", "admin"];

export const isValidRole = (role) => {
  return validRoles.includes(role);
};

export const isAdmin = (role) => {
  return role === "admin";
};
