const defaultState = {
  username: null,
  plan_id: null,
  journal_id: null,
  story_id: null,
  image_url: null,
  home: null,
};

const paramsReducer = (prevState = defaultState, action: any) => {
  switch (action.type) {
    case 'ROUTE_PLAN':
      return {
        ...prevState,
        plan_id: action.plan_id,
      };
    case 'ROUTE_IMAGE':
      return {
        ...prevState,
        image_url: action.image_url,
      };
    case 'ROUTE_JOURNAL':
      return {
        ...prevState,
        journal_id: action.journal_id,
      };
    case 'ROUTE_USER':
      return {
        ...prevState,
        username: action.username,
      };
    case 'ROUTE_RESET':
      return {
        ...defaultState,
      };
    case 'ROUTE_DETAIL':
      return {
        ...prevState,
        journal_id: action.journal_id,
        story_id: action.story_id,
      };
    default:
      return prevState;
  }
};

export default paramsReducer;
