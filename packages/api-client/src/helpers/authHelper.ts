export const authHelper = {
    authToken: () => '',
    refreshToken: () => '',
    username: () => '',
    authHeader: () => {
      try {
        const token = authHelper.authToken();
        if (token) {
          return { Authorization: `Bearer ${token}` };
        }
      } catch (e) {
        console.log(`Error generating request auth headers. ${JSON.stringify(e)}`);
      }
      return {};
    },
  };
