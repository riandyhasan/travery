export const routePlan = ({ plan }: { plan?: string | null }) => ({
  type: 'ROUTE_PLAN',
  plan_id: plan,
});

export const tempImage = ({ image_url }: { image_url?: string | null }) => ({
  type: 'ROUTE_IMAGE',
  image_url: image_url,
});

export const routeJournal = ({ journal }: { journal?: string | null }) => ({
  type: 'ROUTE_JOURNAL',
  journal_id: journal,
});

export const routeDetail = ({ journal, story }: { journal?: string | null; story?: string | null }) => ({
  type: 'ROUTE_DETAIL',
  journal_id: journal,
  story_id: story,
});

export const routeUser = ({ user }: { user?: string | null }) => ({
  type: 'ROUTE_USER',
  username: user,
});

export const resetParams = () => ({
  type: 'ROUTE_RESET',
});
