<template>
  <div>
    PostsListViewItemMusic.vue
    <pre>post{{ post }}</pre>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
}
</script>
