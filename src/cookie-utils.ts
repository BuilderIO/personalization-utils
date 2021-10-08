export const getTargetingCookies = (cookiesMap: Record<string, string>) =>
  Object.keys(cookiesMap).filter((cookie) =>
    cookie.startsWith("builder.userAttributes")
  );
