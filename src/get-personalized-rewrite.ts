import { getUrlSegments } from "./url-utils";
import { getTargetingCookies } from "./cookie-utils";

const delimeter = ';'

export const isPersonalizedPath = (path?: string) => {
  return path?.startsWith(delimeter)
}

export const getPersonalizedRewrite = (
  pathname: string,
  cookies: Record<string, string>
) => {
  const attributes = getTargetingCookies(cookies);
  const values = attributes.reduce((acc, cookie) => {
    const value = cookies[cookie];
    const key = cookie.split("builder.userAttributes.")[1];
    return {
      ...acc,
      ...(typeof value === 'string' && { [key]: value }),
    };
  }, {});

  if (Object.keys(values).length > 0) {
    return `/;${getUrlSegments({
      urlPath: pathname,
      ...values,
    }).join(delimeter)}`;
  }

  return false;
};
