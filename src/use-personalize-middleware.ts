import type { EdgeRequest, EdgeResponse, EdgeNext } from "next";
import { getPersonalizedRewrite } from "./get-personalized-rewrite";

export const usePersonalizeMiddleware = (
  req: EdgeRequest,
  res: EdgeResponse,
  next: EdgeNext
) => {
  // Get and set the bucket cookie
  if (
    req.url?.pathname.includes("favicon") ||
    req.url?.pathname.includes("api")
  ) {
    return next();
  }
  const rewrite = getPersonalizedRewrite(req.url?.pathname!, req.cookies);

  if (rewrite) {
    res.rewrite(rewrite);
  } else {
    next();
  }
};
