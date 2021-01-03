<template>
  <div>
    PostsListViewItemVideo.vue
    <pre>{{ post }}</pre>
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
