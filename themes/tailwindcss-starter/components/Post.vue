<template>
  <div>
    <!-- <h1>{{ post.title }}</h1>
    <h3>{{ post.description }}</h3>
    <nuxt-content :document="post" /> -->
    <pre>{{ post }}</pre>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      default: null,
    },
  },
}
</script>
