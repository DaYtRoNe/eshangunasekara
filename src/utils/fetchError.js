// Turn a Firestore error into something a visitor can understand
export const getFetchErrorMessage = (err) => {
  if (err?.code === 'permission-denied') return 'Access to this content is currently restricted. Please try again later.';
  if (err?.code === 'unavailable') return 'Unable to reach the server. Check your connection and try again.';
  return 'Something went wrong while loading. Please try again.';
};
