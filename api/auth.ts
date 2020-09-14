import { Router } from 'express'
import axios from 'axios'
import boom from 'boom'

const router: Router = Router()

const githubLoginOauthAccessTokenEndpoint: string =
  process.env.GITHUB_LOGIN_OAUTH_ACCESS_TOKEN_ENDPOINT as string

const githubOauthAppsClientId: string =
  process.env.GITHUB_OAUTH_APPS_CLIENT_ID as string

const githubOauthAppsClientSecret: string =
  process.env.GITHUB_OAUTH_APPS_CLIENT_SECRET as string

const githubApiUserEndpoint: string =
  process.env.GITHUB_API_USER_ENDPOINT as string

type AccessTokenRequest = {
  'client_id': string,
  'client_secret': string,
  'code': string
}

type AccessTokenResponse = {
  'access_token': string,
  'token_type': string,
  'scope': string
};

router.use((req, _res, next) => {
  if (!req.session) {
    return next(boom.badImplementation())
  }

  return next()
})

// check if user is authenticated
router.get('/', (req, res) => {
  const isAuthenticated: boolean = !!req.session!.accessToken

  res.json({ isAuthenticated })
})

// authenticate user
router.post('/', async (req, res, next) => {
  try {
    if (!req.body.code) {
      throw boom.badRequest('missing "code" body parameter')
    }

    const accessTokenRequest: AccessTokenRequest = {
      client_id: githubOauthAppsClientId,
      client_secret: githubOauthAppsClientSecret,
      code: req.body.code
    }

    const { data: { access_token: accessToken } } = await axios.post<AccessTokenResponse>(
      githubLoginOauthAccessTokenEndpoint,
      accessTokenRequest,
      {
        headers: {
          Accept: 'application/json'
        }
      }
    )

    const { data: { login } } = await axios.get<{ login: string }>(githubApiUserEndpoint, {
      headers: {
        Authorization: `token ${accessToken}`
      }
    })

    req.session!.accessToken = accessToken
    req.session!.login = login

    res.json()
  } catch (err) {
    next(err.isBoom ? err : boom.badImplementation(err.message))
  }
})

router.delete('/', (req, res, next) => {
  req.session!.destroy((err) => {
    if (err) { return next(boom.badImplementation(err)) }

    res.json()
  })
})

export default router
