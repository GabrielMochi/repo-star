<template>
  <v-container v-if="user" fluid>
    <v-row>
      <v-col v-if="$vuetify.breakpoint.mdAndDown">
        <v-container fluid class="px-0">
          <v-row align="center" justify="start">
            <v-col cols="12" sm="6" md="3" class="py-1">
              <v-card dark class="d-flex align-center justify-center pa-2">
                <v-avatar size="100%">
                  <img :src="user.avatarUrl" :alt="user.name">
                </v-avatar>
              </v-card>
            </v-col>
            <v-col class="py-1">
              <v-card outlined color="transparent">
                <v-card-title class="d-block px-0">
                  <h3 class="title">
                    {{ user.name }}
                  </h3>
                  <div class="subtitle-1">
                    {{ user.login }}
                  </div>
                </v-card-title>
                <v-card-text class="px-0">
                  <div v-if="user.location">
                    <v-icon small>
                      {{ icons.mdiMapMarker }}
                    </v-icon>
                    {{ user.location }}
                  </div>
                  <div v-if="user.email">
                    <v-icon small>
                      {{ icons.mdiEmail }}
                    </v-icon>
                    {{ user.email }}
                  </div>
                  <div>
                    <v-icon small>
                      {{ icons.mdiLink }}
                    </v-icon>
                    <a :href="user.url" target="_blank" class="black--text">{{ user.url }}</a>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <v-col cols="12" lg="8">
        <h1>
          {{ firstName }}'s star repositories
        </h1>
        <div class="mt-4">
          <v-row align="start" justify="start">
            <v-col
              v-for="repository in user.starredRepositories"
              :key="repository.url"
              cols="12"
              sm="6"
              md="4"
              lg="6"
              xl="4"
            >
              <v-card dark class="my-4">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      <v-icon small>
                        {{ icons.mdiBook }}
                      </v-icon>
                      {{ repository.owner.login }}/{{ repository.name }}
                    </v-list-item-title>
                    <v-card-text class="grey--text">
                      {{ repository.description }}
                    </v-card-text>
                    <v-container class="py-0 caption">
                      <v-row align="center" justify="start">
                        <v-col
                          cols="2"
                          class="py-1 px-0 text-ellipsis text-center"
                        >
                          <v-btn
                            v-if="userStarredRepository(repository.url)"
                            text
                            icon
                            x-small
                            @click="unstarRepository(repository)"
                          >
                            <v-icon small>
                              {{ icons.mdiStar }}
                            </v-icon>
                          </v-btn>
                          <v-btn
                            v-else
                            text
                            icon
                            x-small
                            @click="starRepository(repository)"
                          >
                            <v-icon small>
                              {{ icons.mdiStarOutline }}
                            </v-icon>
                          </v-btn>
                          <span>
                            {{ repository.stargazers.totalCount }}
                          </span>
                        </v-col>
                        <v-col
                          v-if="repository.primaryLanguage"
                          cols="3"
                          class="py-1 px-0 text-ellipsis text-center"
                        >
                          <v-icon small class="mr-1">
                            {{ icons.mdiCodeBraces }}
                          </v-icon>
                          {{ repository.primaryLanguage.name }}
                        </v-col>
                        <v-col
                          v-if="repository.licenseInfo"
                          cols="3"
                          class="py-1 px-0 text-ellipsis text-center"
                        >
                          {{ repository.licenseInfo.name }}
                        </v-col>
                        <v-col
                          v-if="repository.licenseInfo"
                          class="py-1 px-0 text-ellipsis text-center"
                        >
                          Updated on {{ formatUpdatedAtDate(repository.updatedAt) }}
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-col>
      <v-col
        v-if="$vuetify.breakpoint.lgAndUp"
        id="user-profile-collum"
        lg="3"
        xl="2"
        :class="$vuetify.breakpoint.name"
      >
        <v-card
          dark
          class="d-flex align-center justify-center pa-2"
        >
          <v-avatar size="100%">
            <img :src="user.avatarUrl" :alt="user.name">
          </v-avatar>
        </v-card>
        <v-card outlined color="transparent" class="mt-4">
          <v-card-title class="d-block px-0">
            <h3>{{ user.name }}</h3>
            <div class="subtitle-1">
              {{ user.login }}
            </div>
          </v-card-title>
          <v-card-text class="d-block px-0">
            <div v-if="user.bio" class="subtitle-2">
              {{ user.bio }}
            </div>
            <div :class="user.bio ? 'mt-4' : 'mt-0'">
              <div v-if="user.location">
                <v-icon small>
                  {{ icons.mdiMapMarker }}
                </v-icon>
                {{ user.location }}
              </div>
              <div v-if="user.email">
                <v-icon small>
                  {{ icons.mdiEmail }}
                </v-icon>
                {{ user.email }}
              </div>
              <div>
                <v-icon small>
                  {{ icons.mdiLink }}
                </v-icon>
                <a :href="user.url" target="_blank" class="black--text">{{ user.url }}</a>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  mdiMapMarker, mdiEmail, mdiLink,
  mdiStar, mdiStarOutline, mdiBook,
  mdiCodeBraces
} from '@mdi/js'

import dateformat from 'dateformat'

export default {
  data: () => ({
    user: null,
    loading: false,
    userDoesNotExists: false,
    dateformat,
    icons: {
      mdiMapMarker,
      mdiEmail,
      mdiLink,
      mdiStar,
      mdiStarOutline,
      mdiBook,
      mdiCodeBraces
    }
  }),
  computed: {
    firstName () {
      const [firstName] = this.user.name.split(' ')
      return firstName
    }
  },
  created () {
    this.$emit('userSelected')
    this.getUser(this.$route.params.login)
  },
  beforeRouteUpdate (to, _from, next) {
    this.$emit('userSelected')
    this.getUser(to.params.login)
    next()
  },
  methods: {
    async getUser (login) {
      this.loading = true

      try {
        const user = await this.$axios.$get(`/api/user/${login}`)
        this.user = user
      } catch (err) {
        this.userDoesNotExists = true
      } finally {
        this.loading = false
      }
    },
    async starRepository (repository) {
      this.$store.commit('addStarredRepository', repository)

      try {
        await this.$axios.$put(`/api/starred/${repository.owner.login}/${repository.name}`)
      } catch (err) {
        this.$store.commit('removeStarredRepository', repository)
      }
    },
    async unstarRepository (repository) {
      this.$store.commit('removeStarredRepository', repository)

      try {
        await this.$axios.$delete(`/api/starred/${repository.owner.login}/${repository.name}`)
      } catch (err) {
        this.$store.commit('addStarredRepository', repository)
      }
    },
    userStarredRepository (repositoryUrl) {
      return this.$store.state.user.starredRepositories.some(({ url }) => url === repositoryUrl)
    },
    formatUpdatedAtDate (updatedAt) {
      return this.dateformat(updatedAt, 'mmm d, yyyy')
    }
  }
}
</script>

<style scoped>
  #user-profile-collum {
    position: fixed;
    right: 0px;
    top: 78px;
  }

  #user-profile-collum.xl {
    right: 96px !important;
  }

  #user-profile-collum.md,
  #user-profile-collum.sm,
  #user-profile-collum.xs {
    right: 96px !important;
  }
</style>
