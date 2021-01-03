<template>
  <div class="flex space-x-2">
    <!-- <pre>{{ social() }}</pre> -->
    <!-- <div class="">Facebook Twitter Instagram Email</div> -->
    <div v-for="(link, i) in social()" :key="i" class="text-gray-300">
      <a :href="link.url" target="_blank">
        <component
          :is="`Icon${link.name}`"
          class="h-8 w-8 fill-current"
          :aria-label="`Connect via ${link.name}`"
        />
      </a>
    </div>
  </div>
</template>

<script>
import IconEmail from '@/assets/icons/email.svg?inline'
import IconFacebook from '@/assets/icons/facebook.svg?inline'
import IconTwitter from '@/assets/icons/twitter.svg?inline'
// import IconYoutube from '@/assets/icons/youtube.svg?inline'

export default {
  components: {
    IconFacebook,
    IconEmail,
    IconTwitter,
    // IconYoutube,
  },
  data: () => {
    return {
      //   links: $config.siteData,
    }
  },
  methods: {
    social() {
      return this.$config.siteData.networks.filter((n) => n.showInNav)
    },
  },
}
</script>
