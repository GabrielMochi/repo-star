import { Router } from 'express'
import boom from 'boom'
import axios from 'axios'
import accessTokenValidationMiddleware from '../utils/accessTokenValidationMiddleware'

const router: Router = Router()

const githubApiUserEndpoint: string =
  process.env.GITHUB_API_USER_ENDPOINT as string

router.use(accessTokenValidationMiddleware())

router.put('/:owner/:repo', async (req, res, next) => {
  try {
    const { accessToken } = req.session!
    const { owner, repo } = req.params

    await axios.put(`${githubApiUserEndpoint}/starred/${owner}/${repo}`, null, {
      headers: {
        Authorization: `token ${accessToken}`
      }
    })

    res.json()
  } catch (err) {
    next(err.isBoom ? err : boom.badImplementation(err.message))
  }
})

router.delete('/:owner/:repo', async (req, res, next) => {
  try {
    const { accessToken } = req.session!
    const { owner, repo } = req.params

    await axios.delete(`${githubApiUserEndpoint}/starred/${owner}/${repo}`, {
      headers: {
        Authorization: `token ${accessToken}`
      }
    })

    res.json()
  } catch (err) {
    next(err.isBoom ? err : boom.badImplementation(err.message))
  }
})

export default router
