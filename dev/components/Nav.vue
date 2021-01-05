<template>
  <div>
    <nav
      class="transition-all w-screen fixed duration-900 z-50 ease-in-out text-gray-100"
      :class="
        $route.path !== '/' || scrollY >= yTrigger || menu
          ? 'nav-bar'
          : 'nav-bar-home'
      "
    >
      <!--  dummy div to prevent dynamic classes from being purged -->
      <div
        v-show="false"
        class="transition-all w-screen fixed duration-900 z-50 ease-in-out text-gray-300 bg-gray-800 shadow-lg"
      ></div>
      <div
        class="container mx-auto px-6 py-3 md:flex md:justify-between md:items-center"
      >
        <div class="flex justify-between items-center">
          <!-- brand -->
          <div class="z-10 brand" @click="menu = false">
            <nuxt-link
              class="text-gray-300 italic font-serif font-thin text-2xl md:text-3xl lg:text-4xl hover:text-gray-400"
              to="/"
            >
              {{ $config.siteData.name }}
            </nuxt-link>
          </div>

          <!-- mobile menu -->
          <div
            class="md:hidden tham tham-e-squeeze tham-w-6"
            :class="menu && 'tham-active'"
            @click="menu = !menu"
          >
            <div class="tham-box">
              <div class="tham-inner bg-gray-100" />
            </div>
          </div>
        </div>

        <!-- desktop links -->
        <div
          class="block transition-all duration-900 ease-in-out md:flex items-center"
          :class="menu ? 'mt-2' : 'hidden'"
        >
          <div
            class="flex flex-col md:flex-row md:mx-6 space-y-1 md:space-x-6 md:space-y-0"
            @click="menu = false"
          >
            <!-- pages -->
            <nuxt-link
              v-for="(page, i) in $config.navigation.pages"
              :key="i"
              :to="page.path"
              class="text-sm md:text-base lg:text-lg text-gray-200 font-medium hover:text-gray-400 transform"
              >{{ page.title }}</nuxt-link
            >
            <!-- posts -->
            <nuxt-link
              v-for="(post, i) in $config.navigation.posts"
              :key="i"
              :to="post.path"
              class="text-sm md:text-base lg:text-lg text-gray-200 font-medium hover:text-gray-400 transform"
              >{{ post.title }}</nuxt-link
            >
          </div>
        </div>
      </div>
    </nav>

    <!-- transparent layer when menu open -->
    <button
      v-if="menu"
      tabindex="-1"
      class="fixed w-full h-full inset-0 cursor-default z-20 bg-black opacity-50"
      @click="menu = false"
    ></button>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      scrollY: 0,
      yTrigger: 20,
      menu: false,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      this.scrollY = window.scrollY
    },
  },
}
</script>

<style scoped lang="postcss">
.brand {
  background-color: white;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: rgba(255, 255, 255, 0.5) 0 3px 2px;
}

.nav-bar-home {
  /* @apply bg-gray-900 md\:py-5; */
  @apply bg-gray-900 py-5;
}

.nav-bar {
  @apply bg-gray-800 shadow-lg;
}
</style>
