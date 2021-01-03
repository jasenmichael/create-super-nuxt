<template>
  <div>
    PostsListViewItemBlog.vue
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
