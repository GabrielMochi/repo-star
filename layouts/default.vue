<template>
  <v-app>
    <v-main>
      <v-container
        v-if="$store.state.isApplicationLoading"
        fluid
        class="fill-height justify-center"
      >
        <v-progress-circular indeterminate size="96" />
      </v-container>
      <nuxt v-else />
    </v-main>
    <v-footer dark fixed>
      <div class="caption">
        Repo Star - By GabrielMochi
      </div>
      <v-spacer />
      <v-btn v-if="$store.state.isAuthenticated" text x-small @click="logout">
        <v-icon left>
          {{ icons.mdiExitToApp }}
        </v-icon>logout
      </v-btn>
    </v-footer>
  </v-app>
</template>

<script>
import { mdiExitToApp } from '@mdi/js'

export default {
  data: () => ({
    icons: {
      mdiExitToApp
    }
  }),
  async created () {
    this.$store.commit('setIsApplicationLoading', true)

    try {
      await this.$store.dispatch('checkIfIsAuthenticate')

      if (!this.$store.state.isAuthenticated) {
        return this.$router.push('/auth')
      }

      await this.$store.dispatch('loadUser')
    } catch (err) {
    } finally {
      this.$store.commit('setIsApplicationLoading', false)
    }
  },
  methods: {
    async logout () {
      try {
        await this.$store.dispatch('logout')
        this.$router.push('/auth')
      } catch (err) {
        alert('something went wrong while logging out')
      }
    }
  }
}
</script>

<style>
.v-application {
  background-color: var(--v-background-base) !important;
}

.text-ellipsis {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
