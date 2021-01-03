<template>
  <div>
    <div class="flex">
      <div class="pr-3">DEV PANEL</div>
      <button
        class="mr-auto px-2 hover:shadow-md rounded-sm border-solid border-2 border-grey-400"
        @click="toggleShowHead()"
      >
        {{ theHead ? 'Hide' : 'Show' }} Head
      </button>
      <nuxt-link to="admin/" target="_blank">
        <button
          class="px-2 hover:shadow-md rounded-sm border-solid border-2 border-grey-400"
        >
          CMS
        </button>
      </nuxt-link>
    </div>
    <div class="flex">
      <pre v-if="theHead"><hr>{{ theHead }}<hr></pre>
      <pre>Path: {{ $route.fullPath }}</pre>
    </div>
    <hr />
  </div>
</template>

<script>
export default {
  //   asyncData({ params }) {
  //     return { params }
  //   },
  data: () => {
    return {
      theHead: false,
    }
  },
  methods: {
    toggleShowHead() {
      this.theHead = this.theHead
        ? false
        : document.head.innerHTML
            .split('<style type=')[0]
            .trim()
            .replace(/\r\n\r\r/g, '\r\n')
      // console.log('clicked..', this.theHead)
    },
  },
}
</script>
