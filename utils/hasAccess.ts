export const isHasAccess = (roles: string[], role: string) => {
  const some = roles?.some((item) => item === role);
  return some;
};
