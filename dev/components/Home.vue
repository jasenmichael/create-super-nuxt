<template>
  <div class="flex-1 text-gray-900 bg-gray-900">
    <div class="bg-gray-900">
      <header
        v-show="false"
        class="text-gray-100 flex flex-col"
        style="height: calc(100vh - 90px)"
      >
        <img
          src="/img/cover1.jpeg"
          class="h-3/5 w-full md:h-full pt-6 object-cover absolute inline-block"
          alt="Crannog live image"
        />
        <div
          class="relative ml-4 mt-24 text-center md:text-left lg:text-left md:ml-20 lg:ml-40"
        >
          <!-- <div class="h-32"></div> -->
          <h1
            class="font-light font-serif italic text-gray-200 header-h text-3xl sm:text-4xl md:text-5xl lg:text-6xl pt-96 sm:pt-60 md:pt-96"
          >
            Celtic Irish Music for the ages
          </h1>
          <br />
          <div
            class="header-t text-xl lg:text-2xl text-gray-200 font-normal italic"
          >
            Welcome to the experience...
          </div>
        </div>
        <div class="mx-auto pt-4 pb-4">
          <a v-smooth-scroll="{ offset: -180 }" href="#welcome">
            <IconChevronRight
              aria-label="Learn more.."
              class="mb-8 h-16 w-16 text-gray-100 fill-current transition-opacity duration-700 transform rotate-90 text-center"
            />
          </a>
        </div>
      </header>

      <Hero />
    </div>
    <!-- <div class="mx-auto px-6 md:px-10 lg:px-36"> -->
    <div
      id="welcome"
      class="flex items-center justify-start w-screen md:px-10 lg:px-18 xl:px-20 md:-mt-32"
    >
      <nuxt-content
        class="md:rounded-md bg-gray-100 z-0 prose-xl justify-center md:prose-2xl max-w-none md:max-w-5/6 p-8 md:px-14"
        :document="page"
      ></nuxt-content>
    </div>
    <!-- meet the band -->
    <TheBand />
    <div>
      <div class="pb-8"></div>
    </div>
  </div>
</template>

<script>
import IconChevronRight from '@/assets/icons/chevron-right.svg?inline'

export default {
  components: { IconChevronRight },
  props: {
    page: {
      type: Object,
      default: null,
    },
  },
  data: () => {
    return {
      scrollY: 0,
      yTrigger: 20,
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

<style scoped>
.header-t,
.header-h {
  text-shadow: 2px 8px 6px rgba(0, 0, 0, 0.2),
    0 -4px 35px rgba(255, 255, 255, 0.3), 0 4px 3px rgba(0, 0, 0, 0.4),
    0 8px 13px rgba(0, 0, 0, 0.1), 0 18px 23px rgba(0, 0, 0, 0.1);
}

.header-t {
  text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
}
</style>
