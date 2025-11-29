export default {
  name: 'featuredProduct',
  title: 'Featured Product (Homepage)',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'subtitle', title: 'Subtitle', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'image', title: 'Image', type: 'image' },
    { name: 'price', title: 'Price', type: 'number' },
    { name: 'badge', title: 'Badge', type: 'string' },
    { name: 'link', title: 'Product Link', type: 'string' },
  ],
}