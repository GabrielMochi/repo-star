<template>
  <v-container fluid class="fill-height">
    <v-row justify="center" align="center" class="fill-height">
      <v-col
        id="search-users-collum"
        cols="12"
        lg="3"
        class="fill-height"
        :class="{ 'py-16': $vuetify.breakpoint.lgAndUp, 'py-4': $vuetify.breakpoint.mdAndDown }"
      >
        <v-text-field
          id="username"
          v-model="username"
          name="username"
          label="Search for a GitHub username"
          :prepend-inner-icon="icons.mdiAccountSearch"
          dark
          solo
          @input="usernameInput"
          @focus="usernameInput"
          @blur="isInputFocus = false"
        />
        <v-card v-for="(user) in users" :key="user.login" dark class="my-2">
          <v-list-item :to="`/user/${user.login}`" @click="onUserClick">
            <v-list-item-avatar>
              <v-img :src="user.avatarUrl" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                <span>{{ user.name }}</span>
                <span class="ml-2 font-weight-bold">{{ user.login }}</span>
              </v-list-item-title>
              <v-list-item-subtitle v-if="user.bio">
                {{ user.bio }}
              </v-list-item-subtitle>
              <v-list-item-subtitle v-if="user.location || user.email" class="mt-2 caption">
                <span>{{ user.location }}</span>
                <span class="ml-4">{{ user.email }}</span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col class="py-8 fill-height" offset-lg="3">
        <nuxt-child :class="{ 'd-none': !showContent }" @userSelected="onUserSelected" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mdiAccountSearch } from '@mdi/js'

export default {
  data: () => ({
    username: null,
    users: [],
    isInputFocus: false,
    isUserSelected: false,
    icons: {
      mdiAccountSearch
    }
  }),
  computed: {
    showContent () {
      if (this.$vuetify.breakpoint.lgAndUp) { return true }
      if (this.isInputFocus) { return false }

      return this.isUserSelected
    }
  },
  methods: {
    async usernameInput () {
      this.isInputFocus = true

      if (!this.username) {
        this.users = []
        return
      }

      try {
        const users = await this.$axios.$get('/api/search/users', {
          params: {
            username: this.username
          }
        })

        this.users = users
      } catch (err) {
        alert('Error while searching user')
      }
    },
    onUserClick () {
      if (this.$vuetify.breakpoint.mdAndDown) {
        this.users = []
      }
    },
    onUserSelected () {
      this.isUserSelected = true
    }
  },
  head: () => ({
    title: 'Home'
  })
}
</script>

<style scoped>
  #search-users-collum {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 7;
  }
</style>
