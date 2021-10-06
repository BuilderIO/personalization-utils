import fetch from 'node-fetch'

const query = `
  query {
    settings
  }
`

export const getAttributes = async (privateKey: string) => {
  return fetch(`https://beta.builder.io/api/v2/admin`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${privateKey}`,
    },
    body: JSON.stringify({
      query,
    }),
  })
    .then((res) => res.json())
    .then((res: any) => res.data.settings.customTargetingAttributes)
}
