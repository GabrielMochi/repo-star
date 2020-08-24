import axios from 'axios'

export const state = () => ({
  isApplicationLoading: false,
  isAuthenticated: false,
  user: null
})

export const mutations = {
  setIsApplicationLoading (state, isApplicationLoading) {
    state.isApplicationLoading = isApplicationLoading
  },
  setIsAuthenticated (state, isAuthenticated) {
    state.isAuthenticated = isAuthenticated
  },
  setUser (state, user) {
    state.user = user
  },
  addStarredRepository (state, repository) {
    state.user.starredRepositories.push(repository)
  },
  removeStarredRepository (state, repository) {
    state.user.starredRepositories = state.user.starredRepositories
      .filter(({ url }) => url !== repository.url)
  }
}

export const actions = {
  async checkIfIsAuthenticate ({ commit }) {
    try {
      const { data: { isAuthenticated } } = await axios.get('/api/auth')
      commit('setIsAuthenticated', isAuthenticated)
    } catch (err) {
      commit('setIsAuthenticated', false)
    }
  },
  async loadUser ({ commit }) {
    try {
      const { data: user } = await axios.get('/api/user')
      commit('setUser', user)
    } catch (err) {
      commit('setUser', null)
    }
  }
}
