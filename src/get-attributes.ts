import axios from 'axios';
import type { AxiosResponse } from 'axios';

const query = `
  query {
    settings
  }
`

export const getAttributes = async (privateKey: string) => {
  const res: AxiosResponse<{ data: any }> = await axios.request({
    url: `https://beta.builder.io/api/v2/admin`,
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${privateKey}`,
    },
    data: JSON.stringify({
      query,
    }),
  })
  return res.data.data.settings.customTargetingAttributes
}
