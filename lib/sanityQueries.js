// Fetch hero slider with all slides (server-safe, supports preview)
export async function getHeroSlider({ preview = false } = {}) {
  // Use server client so drafts are available when preview=true
  const c = preview
    ? getSanityClient({ useCdn: false, token: process.env.SANITY_API_TOKEN })
    : getSanityClient({ useCdn: true })

  const query = `
    *[_type == "heroSlider" && isActive == true][0] {
      _id,
      title,
      isActive,
      slides[] {
        id,
        subtitle,
        title,
        description,
        image,
        ctaText,
        ctaLink,
        alignment,
        badge,
        order,
        isActive
      } | order(order asc)
    }
  `

  const sliderData = await c.fetch(query)

  if (!sliderData || !sliderData.slides) return []

  // Filter active slides, sort by order (defensive), and map to frontend shape
  return (sliderData.slides || [])
    .filter((slide) => slide.isActive)
    .sort((a, b) => (Number(a.order || 0) - Number(b.order || 0)))
    .map((slide) => ({
      id: slide.id,
      subtitle: slide.subtitle,
      title: slide.title,
      description: slide.description,
      image: slide.image ? urlFor(slide.image).width(1920).height(1080).auto('format').url() : null,
      cta: slide.ctaText,
      link: slide.ctaLink,
      align: slide.alignment,
      badge: slide.badge,
    }))
}