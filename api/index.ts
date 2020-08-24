import express, { Express, Router, Response, Request, NextFunction } from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import boom from 'boom'
import auth from './auth'
import search from './search'
import user from './user'
import starred from './starred'

const router: Router = Router()
const app: Express = express()

router.use('/auth', auth)
router.use('/search', search)
router.use('/user', user)
router.use('/starred', starred)

app.use(session({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
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
