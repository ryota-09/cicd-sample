import { createClient } from "microcms-js-sdk"; //ES6

// Initialize Client SDK.
const client_1 = createClient({
  serviceDomain: process.env.NEXT_PUBLIC_DOMAIN_1 ?? "", // YOUR_DOMAIN is the XXXX part of XXXX.microcms.io
  apiKey: process.env.NEXT_PUBLIC_API_KEY_1 ?? "",
  // retry: true // Retry attempts up to a maximum of two times.
});

export const getHandler1 = async () => {
  const data = await client_1.get({
    endpoint: "news"
  })
  return data
}

const client_2 = createClient({
  serviceDomain: process.env.NEXT_PUBLIC_DOMAIN_2 ?? "", // YOUR_DOMAIN is the XXXX part of XXXX.microcms.io
  apiKey: process.env.NEXT_PUBLIC_API_KEY_2 ?? "",
  // retry: true // Retry attempts up to a maximum of two times.
});

export const getHandler2_news = async () => {
  const data = await client_2.get({
    endpoint: "news"
  })
  return data
}

export const getHandler2_blogs = async (filters: string) => {
  const data = await client_2.get({
    endpoint: "blogs",
    queries: {
      filters: filters
    }
  })
  return data
}
