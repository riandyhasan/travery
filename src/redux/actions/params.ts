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

export const resetParams = () => ({
  type: 'ROUTE_RESET',
});
