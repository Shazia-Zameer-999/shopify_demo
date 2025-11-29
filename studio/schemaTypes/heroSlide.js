export default {
  name: 'hero',
  title: 'Hero slide',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'subtitle', title: 'Subtitle', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'image', title: 'Image', type: 'image' },
    { name: 'ctaLabel', title: 'CTA Label', type: 'string' },
    { name: 'ctaLink', title: 'CTA Link', type: 'string' },
    { name: 'badge', title: 'Badge', type: 'string' },
    { name: 'order', title: 'Order', type: 'number' },
    { name: 'align', title: 'Align', type: 'string', options: { list: ['left','center','right'] } },
  ],
}