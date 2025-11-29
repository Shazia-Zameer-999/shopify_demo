// lib/sanity.client.js
import sanityClient from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, // e.g. 6xlwj7i7
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01',
  useCdn: true,
})

const builder = createImageUrlBuilder(client)
export const urlFor = (source) => builder.image(source)

export default client