# Builder Personalization Utils
A collection of handy utilities when working with delivering personalized Builder content at the edge.

# How to start with personalized rewrites ? 

using `getPersonalizedRewrite` identifying the current personalization target based on cookies and origin URL path, it should be used in middleware in combination with a nextjs path in the same middleware folder, to start add a `builder` folder in your pages , with a single file `[[...path]].tsx`:

```ts
import type { GetStaticPropsContext } from 'next'
// where the path component here responsible for rendering the page at the original Url
import Path from '../[[...path]]'
import { getPersonalizedPage } from '@builder.io/personalization-utils'
import builderConfig from '@config/builder'

export async function getStaticProps({
  params,
}: GetStaticPropsContext<{ path: string[] }>) {
  const page = await getPersonalizedPage(
    params?.path!,
    'page',
    builderConfig.apiKey
  )
  return {
    props: {
      page,
    },
    revalidate: 5,
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  }
}

export default Path
```
Now that we have a path for rendering personalized variations ready, let's route to it in the middleware:
```ts
  const rewrite = getPersonalizedRewrite(req.url?.pathname! , req.cookies)
  if (rewrite) {
    res.rewrite(rewrite)
  } else {
    next();
  }

```

Great now that we have the personzlized routes ready all we need to do is set the corresponding cookie for any of the targeting attribute we have in builder:
```ts
  const audience = await myCDP.identifyAudience(userID);
  setCookie(`builder.userAttributes.audience`, audience)
```
Once the cookie is set, all builder content matcing from now on will weigh in the current audience segment.




