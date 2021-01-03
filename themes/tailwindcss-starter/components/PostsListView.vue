<template>
  <div>
    PostsListView.vue
    <hr />
    <div v-for="(post, i) in posts" :key="i">
      <PostsListViewItemMusic v-if="post.type === 'music'" :post="post" />
      <PostsListViewItemVideo v-if="post.type === 'videos'" :post="post" />
      <PostsListViewItemPhoto v-if="post.type === 'photos'" :post="post" />
      <PostsListViewItemBlog v-if="post.type === 'blog'" :post="post" />
      <PostsListViewItemArticle v-if="post.type === 'articles'" :post="post" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    posts: {
      type: Array,
      default() {
        return []
      },
    },
  },
}
</script>
