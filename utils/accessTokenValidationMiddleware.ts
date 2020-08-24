import { Request, Response, NextFunction, RequestHandler } from 'express'
import boom from 'boom'

export default function (): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.session) {
      return next(boom.badImplementation())
    }

    if (!req.session.accessToken) {
      return next(boom.unauthorized())
    }

    return next()
  }
}
