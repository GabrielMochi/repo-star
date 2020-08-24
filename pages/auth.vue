<template>
  <v-container fluid class="fill-height px-16">
    <v-row align="center">
      <v-col v-if="!isAuthenticating" cols="12" lg="3">
        <v-card id="auth-card" outlined class="transparent">
          <v-card-title>
            <v-icon color="secondary" large class="mr-2">
              {{ icons.mdiGithub }}
            </v-icon>GitHub Authentication
          </v-card-title>
          <v-card-actions>
            <v-btn
              block
              color="secondary"
              :href="githubOauthUrl"
              :disabled="isAuthenticating"
            >
              Authenticate
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col v-else>
        <v-container>
          <v-icon id="auth-icon" size="64" color="secondary">
            {{ icons.mdiGithub }}
          </v-icon>
          <v-progress-linear indeterminate color="secondary" height="8" />
          <div class="overline text-left">
            Authenticating...
          </div>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mdiGithub } from '@mdi/js'

export default {
  data: () => ({
    icons: { mdiGithub },
    githubOauthUrl: `${process.env.githubLoginOauthAuthorizeEndpoint}` +
      `?client_id=${process.env.githubOauthAppsClientId}` +
      '&scope=user:email%20repo',
    isAuthenticating: false
  }),
  async created () {
    this.isAuthenticating = !!this.$route.query.code

    if (this.isAuthenticating) {
      await this.validateAuthentication(this.$route.query.code)
    }
  },
  methods: {
    async validateAuthentication (code) {
      try {
        await this.$axios.$post('/api/auth', { code })
        await this.$store.dispatch('loadUser')
        this.$router.push('/')
      } catch (error) {
        alert('error')
      }
    }
  },
  head: () => ({
    title: 'Auth'
  })
}
</script>

<style scoped>
#auth-card {
  border-color: #212121 !important;
  border-width: 4px;
  border-radius: 8px;
}

#auth-icon {
  position: absolute;
  left: calc(50% - 64px / 2);
  top: calc(40% - 64px / 2);
}
</style>
