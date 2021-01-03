<template>
  <div></div>
</template>

<script>
export default {
  layout: 'cms',
  data: () => {
    return {}
  },
  mounted() {
    if (process.client) {
      // eslint-disable-line
      // NetlifyCmsApp.init()
      NetlifyCmsApp.init({
        // merge config with static/admin/config.yml
        config: {
          site_url:
            (this.$config.ngrok && this.$config.ngrok.url) ||
            this.$config.baseUrl,
        },
      })
    }
  },
  head: {
    script: [
      { src: 'https://unpkg.com/react@^16/umd/react.production.min.js' },
      {
        src: 'https://unpkg.com/react-dom@^16/umd/react-dom.production.min.js',
      },
      { src: 'https://unpkg.com/netlify-cms-app/dist/netlify-cms-app.js' },
    ],
  },
}
</script>
