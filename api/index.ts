import express, { Express, Router, Response, Request, NextFunction } from 'express'
import redis, { RedisClient } from 'redis'
import session from 'express-session'
import ConnectSessionRedis, { RedisStore } from 'connect-redis'
import bodyParser from 'body-parser'
import boom from 'boom'
import auth from './auth'
import search from './search'
import user from './user'
import starred from './starred'

const router: Router = Router()
const app: Express = express()
const RedisSessionStore: RedisStore = ConnectSessionRedis(session)
const redisClient: RedisClient = redis.createClient(process.env.REDIS_URL || '')

router.use('/auth', auth)
router.use('/search', search)
router.use('/user', user)
router.use('/starred', starred)

app.use(session({
  store: new RedisSessionStore({ client: redisClient }),
  cookie: {
    httpOnly: true,
    secure: process.env.SESSION_SECURE === 'true',
    maxAge: 6 * 60 * 60 * 1000, // 6 hours
    sameSite: true
  },
  name: 'connect.repostar.sid',
  secret: process.env.SESSION_SECRET as string,
  saveUninitialized: true,
  resave: true
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api', router)

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const boomErr: boom = err.isBoom
    ? err
    : boom.badImplementation(err.message)

  if (boomErr.isServer) {
    console.error(boomErr)
  }

  return res.status(boomErr.output.statusCode).json(boomErr.output.payload)
})

export default app
