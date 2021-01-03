<template>
  <div>
    PostsGridView.vue
    <hr />
    <!-- <div v-for="(post, i) in posts" :key="i">
      <MusicGridItem v-if="post.dir === '/music'" :post="post" />
      <VideosGridItem v-if="post.dir === '/videos'" :post="post" />
      <PhotosGridItem v-if="post.dir === '/photos'" :post="post" />
      <BlogGridItem v-if="post.dir === '/blog'" :post="post" />
      <ArticlesGridItem v-if="post.dir === '/articles'" :post="post" />
    </div> -->
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
