import { Router } from 'express'
import { graphql } from '@octokit/graphql'
import boom from 'boom'
import accessTokenValidationMiddleware from '../utils/accessTokenValidationMiddleware'
import User from '~/models/User'
import Query from '~/models/Query'

const router: Router = Router()

router.use(accessTokenValidationMiddleware())

router.get('/users', async (req, res, next) => {
  try {
    const { accessToken } = req.session!
    const { username } = req.query

    if (!username) {
      throw boom.badRequest('query parameter "username" is missing')
    }

    const { search: { edges } } = await graphql<{ search: Query<User> }>(
      `
        query searchUsers($username: String!) {
          search(query: $username, type: USER, first: 6) {
            edges {
              node {
                ... on User {
                  login
                  name
                  bio
                  location
                  avatarUrl
                  url
                  email
                }
              }
            }
          }
        }
      `,
      {
        username,
        headers: {
          authorization: `token ${accessToken}`
        }
      }
    )

    const users: User[] = edges
      .map<User>(({ node: user }) => user)
      .filter(user => !!user)
      .filter(user => Object.keys(user).length > 0)

    res.json(users)
  } catch (err) {
    next(err.isBoom ? err : boom.badImplementation(err.message))
  }
})

export default router
