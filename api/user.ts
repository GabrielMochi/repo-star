import { Router } from 'express'
import { graphql } from '@octokit/graphql'
import boom from 'boom'
import accessTokenValidationMiddleware from '../utils/accessTokenValidationMiddleware'
import User from '~/models/User'
import Query from '~/models/Query'
import Repository from '~/models/Repository'

const router: Router = Router()

router.use(accessTokenValidationMiddleware())

router.get('/', async (req, res, next) => {
  try {
    const { accessToken } = req.session!
    const { login } = req.session!

    const { user } = await graphql<{ user: User }>(
      `
        query getUsers($login: String!) {
          user(login: $login) {
            login
            name
            bio
            location
            avatarUrl
            url
            email
            starredRepositories {
              edges {
                node {
                  ... on Repository {
                    url
                    updatedAt
                    owner { login }
                    primaryLanguage { name }
                    stargazers { totalCount }
                    licenseInfo { name }
                  }
                }
              }
            }
          }
        }
      `,
      {
        login,
        headers: {
          authorization: `token ${accessToken}`
        }
      }
    )

    user.starredRepositories = (user.starredRepositories as Query<Repository>).edges
      .map<Repository>(({ node: repository }) => repository)

    res.json(user)
  } catch (err) {
    next(err.isBoom ? err : boom.badImplementation(err.message))
  }
})

router.get('/:login', async (req, res, next) => {
  try {
    const { accessToken } = req.session!
    const { login } = req.params

    const { user } = await graphql<{ user: User }>(
      `
        query getUsers($login: String!) {
          user(login: $login) {
            login
            name
            bio
            location
            avatarUrl
            url
            email
            starredRepositories {
              edges {
                node {
                  ... on Repository {
                    name
                    description
                    url
                    updatedAt
                    owner { login }
                    primaryLanguage { name }
                    stargazers { totalCount }
                    licenseInfo { name }
                  }
                }
              }
            }
          }
        }
      `,
      {
        login,
        headers: {
          authorization: `token ${accessToken}`
        }
      }
    )

    user.starredRepositories = (user.starredRepositories as Query<Repository>).edges
      .map<Repository>(({ node: repository }) => repository)

    res.json(user)
  } catch (err) {
    next(err.isBoom ? err : boom.badImplementation(err.message))
  }
})

export default router
