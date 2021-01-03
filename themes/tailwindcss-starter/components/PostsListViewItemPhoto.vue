<template>
  <div>
    PostsListViewItemPhoto.vue
    <div>
      <pre> {{ post }}</pre>
    </div>
    <!-- <div>{{ post }}</div> -->
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
