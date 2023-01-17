import jwt from 'jsonwebtoken'
import express from "express"

export const verifyAuthentication = (req: express.Request, res: express.Response, next: Function) => {
  try {
    const authorizationHeader = req.headers.authorization
    let token: string;
    // @ts-ignore
    token = (authorizationHeader.split(" ")[1] as unknown) as string;
    const { TOKEN_SECRET } = process.env
    jwt.verify(token, TOKEN_SECRET as string)
    next()
  } catch (error) {
    res.status(401).send("Unauthorized")
  }
}
