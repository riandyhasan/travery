const defaultState = {
  auth: null,
};

const authReducer = (prevState = defaultState, action: any) => {
  switch (action.type) {
    case 'AUTH_LOGIN':
      return {
        ...prevState,
        auth: action.auth,
      };
    case 'AUTH_LOGOUT':
      return {
        ...defaultState,
      };
    default:
      return prevState;
  }
};

export default authReducer;
