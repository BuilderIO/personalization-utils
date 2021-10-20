# Builder Personalization Utils

A collection of handy utilities when working with delivering personalized Builder content at the edge.

```
npm install @builder.io/personalization-utils
```

# How to start with personalized rewrites ? 

using `getPersonalizedRewrite` identifies the current personalization target based on cookies and origin URL path, it should be used in middleware in combination a static catch all page generation `[...path].tsx`:

```ts
// in pages/[[...path]].tsx
export async function getStaticProps({
  params,
}: GetStaticPropsContext<{ path: string[] }>) {
  const isPersonalizedRequest = params?.path?.[0].startsWith(';');
  const page =
    (await builder
      .get('page', {
        apiKey: builderConfig.apiKey,
        userAttributes: isPersonalizedRequest ?  {
          // if it's a personalized page let's fetch it:
          ...getTargetingValues(params!.path[0].split(';').slice(1))
        }: {
          urlPath: '/' + (params?.path?.join('/') || ''),
        },
        cachebust: true,
      })
      .toPromise()) || null

  return {
    props: {
      page,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 5 seconds
    revalidate: 5,
  }
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  }
}

export default function Path({ page }) {
  return  <BuilderComponent renderLink={Link} model="page" content={page} />
}
```

Now that we have a path for rendering builder content ready, let's route to it in the middleware:
```ts
import { NextFetchEvent, NextResponse } from 'next/server'
import { getPersonalizedRewrite } from '@builder.io/personalization-utils'

const excludededPrefixes = ['/favicon', '/api'];

export default function middleware(
  event: NextFetchEvent
) {
  const url = event.request.nextUrl;
  let response = NextResponse.next();
  if (!excludededPrefixes.find(path => url.pathname?.startsWith(path))) {
    const rewrite = getPersonalizedRewrite(url?.pathname!, event.request.cookies);
    if (rewrite) {
      response = NextResponse.rewrite(rewrite);
    }
  }
  event.respondWith(response);
}

```

Great now that we have the personzlized routes ready all we need to do is set the corresponding cookie for any of the targeting attribute we have in builder:
```ts
  const audience = await myCDP.identifyAudience(userID);
  setCookie(`builder.userAttributes.audience`, audience)
```
Once the cookie is set, all builder content matching from now on will weigh in the current audience segment.



