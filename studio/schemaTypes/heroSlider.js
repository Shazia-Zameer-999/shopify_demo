
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'heroSlider',
  title: 'Hero Slider',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Slider Title',
      type: 'string',
      description: 'Internal title for reference (not displayed)',
      initialValue: 'Main Hero Slider',
    }),
    defineField({
      name: 'slides',
      title: 'Slides',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'slide',
          title: 'Slide',
          fields: [
            defineField({
              name: 'id',
              title: 'Slide ID',
              type: 'string',
              initialValue: () => `slide-${Date.now()}`,
            }),
            defineField({
              name: 'subtitle',
              title: 'Subtitle / Label',
              type: 'string',
              description: 'Small text above the main title (e.g., "Winter 24 / 25 Collection")',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Main Title',
              type: 'string',
              description: 'Large headline text (e.g., "Conquer the Peaks")',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              description: 'Supporting text under the title',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Background Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              description: 'Hero background image (recommended: 1920x1080 or larger)',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'ctaText',
              title: 'Button Text',
              type: 'string',
              description: 'CTA button label (e.g., "Shop Collection")',
              initialValue: 'Shop Now',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'ctaLink',
              title: 'Button Link',
              type: 'string',
              description: 'Where the button links to (e.g., "/products" or "#products")',
              initialValue: '#products',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'alignment',
              title: 'Content Alignment',
              type: 'string',
              description: 'Position of text content on the slide',
              options: {
                list: [
                  {title: 'Left', value: 'left'},
                  {title: 'Center', value: 'center'},
                  {title: 'Right', value: 'right'},
                ],
              },
              initialValue: 'left',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'badge',
              title: 'Badge Text',
              type: 'string',
              description: 'Optional badge label (e.g., "NEW", "TRENDING", "EDITORS\' PICK")',
            }),
            defineField({
              name: 'order',
              title: 'Display Order',
              type: 'number',
              description: 'Controls slide order in the carousel (lower numbers appear first)',
              initialValue: 0,
            }),
            defineField({
              name: 'isActive',
              title: 'Active',
              type: 'boolean',
              description: 'Toggle to show/hide this slide',
              initialValue: true,
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'subtitle',
              media: 'image',
              isActive: 'isActive',
              order: 'order',
            },
            prepare({title, subtitle, media, isActive, order}) {
              return {
                title: `${isActive ? '🟢' : '🔴'} [${order}] ${title}`,
                subtitle,
                media,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'isActive',
      title: 'Slider Active',
      type: 'boolean',
      description: 'Toggle entire slider on/off',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      isActive: 'isActive',
      slides: 'slides',
    },
    prepare({title, isActive, slides}) {
      return {
        title: `${isActive ? '🟢' : '🔴'} ${title}`,
        subtitle: `${slides?.length || 0} slides`,
      }
    },
  },
})