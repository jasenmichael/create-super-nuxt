<template>
  <div>
    <h1>{{ page.title }}</h1>
    <br />
    <h2>{{ page.description }}</h2>
    <nuxt-content :document="page" />
  </div>
</template>

<script>
export default {
  props: {
    page: {
      type: Object,
      default: null,
    },
  },
}
</script>
