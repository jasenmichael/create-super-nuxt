<template>
  <div class="bg-gray-900 h-screen">
    <div class="flex flex-col h-full bg-gray-100">
      <Nav />
      <nuxt />
      <!-- <Footer /> -->
      <footer class="mt-auto text-center bg-gray-900 text-gray-100">
        <hr class="border-gray-700 py-2" />
        <span class="flex items-center justify-center py-8">
          <h4 class="mr-4 text-xl">Keep in touch..</h4>
          <Social />
        </span>
        {{ $config.siteData.name }} All Rights Reserved &copy; {{ year }}
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      year: new Date().getFullYear(),
    }
  },
}
</script>
