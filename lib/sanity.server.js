/* eslint-env node */
// lib/sanity.server.js — server-only Sanity client (for drafts/preview)
import sanityClient from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

export const getSanityClient = ({ useCdn = true, token } = {}) => {
  return sanityClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01',
    useCdn,
    token: token || undefined,
  })
}

const defaultServerClient = getSanityClient({ useCdn: true })
const builder = createImageUrlBuilder(defaultServerClient)
export const urlFor = (source) => builder.image(source).auto('format')

export default defaultServerClient