export const userData = ({
  id,
  email,
  username,
  name,
  avatar,
}: {
  id?: string | null;
  email?: string | null;
  username?: string | null;
  name?: string | null;
  avatar?: string | null;
}) => ({
  type: 'USER_DATA',
  id: id,
  email: email,
  username: username,
  name: name,
  avatar: avatar,
});

export const userLogout = () => ({
  type: 'USER_LOGOUT',
});
