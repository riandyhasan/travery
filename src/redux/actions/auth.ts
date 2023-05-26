export const authLogin = ({ auth }: { auth?: any | null }) => ({
  type: 'AUTH_LOGIN',
  auth: auth,
});

export const authLogout = () => ({
  type: 'AUTH_LOGOUT',
});
