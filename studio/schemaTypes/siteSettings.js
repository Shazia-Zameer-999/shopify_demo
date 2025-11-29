export default {
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    { name: 'bridgeSectionTitle', title: 'Bridge Section Title', type: 'string' },
    { name: 'bridgeSectionDescription', title: 'Bridge Section Description', type: 'text' },
    { name: 'shippingBadgeTitle', title: 'Shipping Badge Title', type: 'string' },
    { name: 'shippingBadgeDescription', title: 'Shipping Badge Description', type: 'string' },
    { name: 'qualityBadgeTitle', title: 'Quality Badge Title', type: 'string' },
    { name: 'qualityBadgeDescription', title: 'Quality Badge Description', type: 'string' },
    { name: 'tagline', title: 'Tagline', type: 'string' },
  ],
}