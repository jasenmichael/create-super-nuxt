<template>
  <div class="hero md:mx-auto flex flex-col md:flex-row items-center md:my-24">
    <!--Left Col-->
    <div
      class="flex flex-col w-full md:mt-auto justify-center items-start md:items-center pt-64 md:pt-12 pb-12 px-12"
    >
      <h1
        class="font-semibold text-white header-t font-serif italic text-3xl pt-10 md:pt-0 sm:text-4xl md:text-5xl lg:text-6xl"
      >
        Celtic Irish Music for the ages
      </h1>
      <br />
      <div class="header-t text-xl text-white lg:text-2xl font-normal italic">
        Welcome to the experience...
      </div>
      <div class="mx-auto pt-2 md:pt-4 pb-0 md:pb-16">
        <a v-smooth-scroll="{ offset: -180 }" href="#welcome">
          <IconChevronRight
            aria-label="Learn more.."
            class="h-16 w-16 text-gray-100 fill-current transition-opacity duration-700 transform rotate-90 text-center"
          />
        </a>
      </div>
    </div>
    <!--Right Col-->
    <!-- <div class="w-full lg:w-1/3"></div>-->
  </div>
</template>

<style scoped>
.hero {
  background-image: url('/img/cover1.jpeg');
  background-position: center;
  background-size: cover;
  position: relative;
  height: calc(100vh - 0.75rem);
}

@media only screen and (max-width: 768px) {
  .hero {
    background-repeat: no-repeat;
    background-position: top;
    max-height: 460px;
  }
}
</style>

<script>
import IconChevronRight from '@/assets/icons/chevron-right.svg?inline'

export default {
  components: { IconChevronRight },
}
</script>
