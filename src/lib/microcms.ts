import { createClient } from "microcms-js-sdk"; //ES6

// Initialize Client SDK.
const client = createClient({
  serviceDomain: process.env.DOMAIN_1 ?? "", // YOUR_DOMAIN is the XXXX part of XXXX.microcms.io
  apiKey: process.env.API_KEY_1 ?? "",
  // retry: true // Retry attempts up to a maximum of two times.
});

export const getHandler1 = async () => {
  const data = await client.get({
    endpoint: "news"
  })
  return data
}
