// const siteData = require('../content/sitedata.json')

export default (meta, siteData) => {
  // defaults if not passed
  const type = 'website'
  const url = siteData.url
  const title = siteData.name
  const description = siteData.description
  const mainImage = url + '/background.jpg'
  const twitterSite =
    '@' +
      siteData.networks.filter((network) => network.name === 'Twitter')[0]
        .handle || ''
  const twitterCard = 'summary_large_image'
  return [
    {
      hid: 'description',
      name: 'description',
      content: (meta && meta.description) || description,
    },
    {
      hid: 'og:type',
      property: 'og:type',
      content: (meta && meta.type) || type,
    },
    {
      hid: 'og:url',
      property: 'og:url',
      content: (meta && meta.url) || url,
    },
    {
      hid: 'og:title',
      property: 'og:title',
      content: (meta && meta.title) || title,
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: (meta && meta.description) || description,
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: (meta && meta.mainImage) || mainImage,
    },
    {
      hid: 'twitter:url',
      name: 'twitter:url',
      content: (meta && meta.url) || url,
    },
    {
      hid: 'twitter:title',
      name: 'twitter:title',
      content: (meta && meta.title) || title,
    },
    {
      hid: 'twitter:description',
      name: 'twitter:description',
      content: (meta && meta.description) || description,
    },
    {
      hid: 'twitter:image',
      name: 'twitter:image',
      content: (meta && meta.mainImage) || mainImage,
    },
    {
      hid: 'twitter:site',
      name: 'twitter:site',
      content: (meta && meta.twitterSite) || twitterSite,
    },
    {
      hid: 'twitter:card',
      name: 'twitter:card',
      content: (meta && meta.twitterCard) || twitterCard,
    },
  ]
}
