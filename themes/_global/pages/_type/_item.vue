<template>
  <div>
    <div v-if="posts">
      <Posts :posts="posts" />
    </div>

    <div v-else-if="post">
      <pre>{{ post }}</pre>
      <Post :post="post" />
    </div>

    <div v-else-if="page">
      <Page :page="page" />
    </div>
  </div>
</template>

<script>
import getMeta from '~/plugins/getMeta.js'

export default {
  async asyncData({ $content, $config, params, error }) {
    const isPage =
      $config.navigation.pages
        .map((page) => page.slug)
        .join(' ')
        .includes(params.type) || false
    const isPostType =
      $config.navigation.posts
        .map((post) => post.slug)
        .join(' ')
        .includes(params.type) || false
    // const type = isPage ? 'page' : isPostType ? params.type : null

    // get single post type item /type/itemSlug
    if (isPostType && params.item) {
      const post = await $content(params.type, params.item)
        .fetch()
        // not found in post type folder, check tumblr
        .catch(async () => {
          return await $content('tumblr', params.item)
            .fetch()
            .catch(() => {
              error({ statusCode: 404, message: 'Post not found' })
            })
        })
      const posts = null
      const page = null
      return { post, posts, page, params }
    }

    // get all of one type /type
    if (isPostType && !params.item) {
      const contentPosts = await $content(params.type)
        .fetch()
        .then((posts) => {
          return posts.map((post) => {
            // add type and content source to each post
            return { ...post, type: params.type }
          })
        })
        .catch(() => {
          return []
        })

      const tumblrPosts = await $content('tumblr')
        .where({ type: params.type })
        .fetch()
        .then((posts) => {
          return posts.map((post) => {
            // add source: 'tumblr' to each post
            return { ...post, type: params.type, source: 'tumblr' }
          })
        })
        .catch((err) => {
          return [] || err
        })
      const posts = [...tumblrPosts, ...contentPosts]
      const post = null
      const page = null
      return { posts, post, page, params }
    }

    // get all types /posts
    if (params.type === 'posts' && !params.item) {
      // get content all posts
      const postTypes = $config.navigation.posts.map((posts) => posts.type)
      const contentPosts = []
      Promise.resolve(
        postTypes.forEach(async (type) => {
          await $content(type)
            .fetch()
            .then((posts) => {
              return posts.map((post) => {
                // add type and content source to each post
                contentPosts.push({
                  ...post,
                  type,
                  source: type,
                })
              })
            })
            .catch((err) => {
              return [] || err
            })
        })
      )

      // get all tumblr posts
      const tumblrPosts = await $content('tumblr')
        .fetch()
        .then((posts) => {
          return posts.map((post) => {
            // add source: 'tumblr' to each post
            return { ...post, source: 'tumblr' }
          })
        })
        .catch((err) => {
          return [] || err
        })

      const posts = [...tumblrPosts, ...contentPosts]
      const post = null
      const page = null
      return { posts, post, page, params }
    }

    // is a page
    if (isPage) {
      const posts = null
      const post = null
      const page = await $content(params.type).fetch()
      return { page, posts, post, params }
    } else {
      error({ statusCode: 404, message: 'Post not found' })
    }
  },
  data() {
    return {
      query: this.$route.query,
    }
  },
  computed: {
    canonicalUrl() {
      return (
        ((this.$config.ngrok && this.$config.ngrok.url) ||
          this.$config.baseUrl) + this.$route.fullPath
      )
    },
    meta() {
      const metaData = {
        // description - adds to: description, og:description, and twitter:description
        // type - adds to:  og:type - website or article..
        // url - sets og:url and twitter:url - defaults to canonical
        // title - adds to og:title and twitter:title
        // mainImage - sets og:image and twitter:image
        // twitterCard - sets twitter:card - defaults to 'summary_large_image'
        // twitterSite - sets twitter:site - defaults to siteData.networks.filter((network) => network.name === 'Twitter')[0].handle

        type: this.page ? 'website' : this.posts ? 'article' : 'website', // use article for blogs and such
        title: this.title,
        description: this.$config.siteData.description,
        url: this.canonicalUrl,
        mainImage:
          ((this.$config.ngrok && this.$config.ngrok.url) ||
            this.$config.baseUrl) +
          ((this.page && this.page.cover) || '/background.jpg'),
      }
      return getMeta(metaData, this.$config.siteData)
    },
    title() {
      return (
        this.params.type.charAt(0).toUpperCase() +
        this.params.type.slice(1) +
        ' Collection'
      )
    },
  },
  head() {
    return {
      title: this.title,
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
