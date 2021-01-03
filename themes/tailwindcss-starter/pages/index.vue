<template>
  <Home :page="page" />
</template>

<script>
// import { mdiMail, mdiTwitter, mdiFacebook, mdiInstagram } from '@mdi/js'
import getMeta from '~/plugins/getMeta.js'

export default {
  async asyncData({ $content }) {
    const page = await $content('home').fetch()
    return {
      page,
    }
  },
  // layout: 'home',
  data: () => ({
    // icons: {
    //   mdiMail,
    //   mdiTwitter,
    //   mdiFacebook,
    //   mdiInstagram,
    // },
    // socialLinks: [],
    // windowSize: {
    //   x: 550,
    //   y: 0,
    // },
  }),
  computed: {
    canonicalUrl() {
      return (
        ((this.$config.ngrok && this.$config.ngrok.url) ||
          this.$config.baseUrl) + this.$route.fullPath
      )
    },
    meta() {
      const metaData = {
        type: 'website', // use article for blogs and such
        title: this.$config.siteData.name,
        description: this.page.description || this.$config.siteData.description,
        url: this.canonicalUrl,
        mainImage:
          ((this.$config.ngrok && this.$config.ngrok.url) ||
            this.$config.baseUrl) + (this.page.cover || '/background.jpg'),
      }
      return getMeta(metaData, this.$config.siteData)
    },
  },
  beforeMount() {},
  methods: {},
  head() {
    return {
      title: this.page.description || this.$config.siteData.description,
      meta: this.meta,
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: this.canonicalUrl,
        },
      ],
    }
  },
}
</script>

<style>
.nuxt-content p {
  margin-bottom: 0.8rem;
}
</style>
