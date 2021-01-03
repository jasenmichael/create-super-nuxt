<template>
  <div>
    <div class="flex flex-wrap justify-center">
      <div
        v-for="(member, i) in band"
        :key="i"
        class="p-4 max-w-lg w-full md:w-1/2"
      >
        <div class="h-full flex flex-col items-center text-center">
          <img
            :alt="`Picture of ${member.name}`"
            class="flex-shrink-0 rounded-md w-full h-64 md:h-80 object-cover object-center mb-4 shadow-md"
            :src="member.image"
          />
          <div class="w-full">
            <h2 class="title-font font-medium text-lg text-white">
              {{ member.name }}
            </h2>
            <h3 class="text-gray-300 mb-3">{{ member.description }}</h3>

            <!-- social links -->
            <div class="flex items-center justify-center space-x-2">
              <div
                v-for="(link, l) in Object.keys(member.connect)"
                :key="l"
                class="text-gray-200"
              >
                <a v-if="link && link !== ''" :href="link" target="_blank">
                  <component
                    :is="`Icon${link.charAt(0).toUpperCase() + link.slice(1)}`"
                    class="h-4 w-4 fill-current"
                    :aria-label="`Connect with ${member.name} via ${
                      link.charAt(0).toUpperCase() + link.slice(1)
                    }`"
                  />
                  <!-- {{ link.charAt(0).toUpperCase() + link.slice(1) }} -->
                </a>
              </div>
            </div>

            <!-- <span class="inline-flex">
              <a class="text-gray-700">
                <svg
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
                  ></path>
                </svg>
              </a>
              <a class="ml-2 text-gray-700">
                <svg
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
                  ></path>
                </svg>
              </a>
              <a class="ml-2 text-gray-700">
                <svg
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
                  ></path>
                </svg>
              </a>
            </span> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconEmail from '@/assets/icons/email.svg?inline'
import IconFacebook from '@/assets/icons/facebook.svg?inline'
import IconTwitter from '@/assets/icons/twitter.svg?inline'
import IconInstagram from '@/assets/icons/instagram.svg?inline'

export default {
  components: {
    IconFacebook,
    IconEmail,
    IconTwitter,
    IconInstagram,
    // IconYoutube,
  },
  data: () => {
    return {
      band: [
        {
          name: 'Frank Ogara',
          description: 'singer songwriter fiddle player',
          avatar: '',
          image: '/img/frank2.jpeg',
          connect: { email: 'yo', facebook: '', twitter: '', instagram: '' },
        },
        {
          name: 'Gabrielle Ogara',
          description: 'singer songwriter performer',
          avatar: '',
          image: '/img/gabriele1.jpeg',
          connect: { email: '', facebook: 'yoyo', twitter: '', instagram: '' },
        },
      ],
    }
  },
}
</script>
