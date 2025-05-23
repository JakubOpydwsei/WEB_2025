import express, { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import 'dotenv/config'
import { OAuth2Client } from 'google-auth-library'

type User = {
  id: number
  login: string
  password: string
  name: string
  surname: string
  role: 'admin' | 'devops' | 'developer' | 'guest'
}

const users: User[] = [
  {
    id: 1,
    login: 'admin',
    password: 'zaq12wsx',
    name: 'Jan',
    surname: 'Kowalski',
    role: 'admin',
  },
  {
    id: 2,
    login: 'developer',
    password: 'zaq12wsx',
    name: 'Anna',
    surname: 'Nowak',
    role: 'developer',
  },
  {
    id: 3,
    login: 'devops',
    password: 'zaq12wsx',
    name: 'Adrian',
    surname: 'Borsuk',
    role: 'devops',
  },
  {
    id: 4,
    login: 'guest',
    password: 'zaq12wsx',
    name: 'Tralalero',
    surname: 'Tralala',
    role: 'guest',
  },
  {
    id: 5,
    login: 'jakubopyd@gmail.com',
    password: '',
    name: 'Jakub',
    surname: 'Opyd',
    role: 'guest'
  },
]

const app = express()
const port = 3000

const tokenSecret = 'default_secret_key'
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
// console.log(process.env.GOOGLE_CLIENT_ID)
const client = new OAuth2Client(CLIENT_ID)

const refreshTokens: Record<string, User> = {}

app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World - simple api with JWT and Google OAuth!')
})

app.post('/token', (req: Request, res: Response) => {
  const { expTime = 60, login, password } = req.body;
  let user = users.find(u => u.login === login);

  if (!user) {
    return res.status(401).send({ message: 'Invalid login or password' });
  }

  if (!user.password) {
    return res.status(403).send({ message: 'User cannot log in with password. Use Google login instead.' });
  }

  user = users.find(u => u.login === login && u.password === password);

  if (!user) {
    return res.status(401).send({ message: 'Invalid login or password' });
  }

  const token = generateToken(+expTime, user);
  const refreshToken = generateToken(60 * 60);
  refreshTokens[refreshToken] = user;

  return res.status(200).json({ token, refreshToken });
});

app.post('/refreshToken', (req: Request, res: Response) => {
  const { refreshToken: refreshTokenFromPost } = req.body

  const user = refreshTokens[refreshTokenFromPost]
  if (!user) {
    return res.status(400).send({ message: 'Invalid refresh token!' })
  }

  const token = generateToken(60, user)
  const newRefreshToken = generateToken(60 * 60)

  refreshTokens[newRefreshToken] = user
  delete refreshTokens[refreshTokenFromPost]

  return res.status(200).json({ token, refreshToken: newRefreshToken })
})

app.post('/google-login', async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    console.log('Brak tokenu w żądaniu');
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      console.log('Brak payload');
      return res.status(401).json({ message: 'Invalid Google token payload' });
    }

    console.log('Token Payload:', payload);

    const user = users.find(u => u.login === payload.email);

    if (!user) {
      console.log(`Użytkownik z emailem ${payload.email} nie istnieje`);
      return res.status(401).json({ message: 'User not registered' });
    }

    const appToken = generateToken(3600, {
      id: user.id,
      login: user.login,
      name: user.name,
      surname: user.surname,
      role: user.role,
    });

    console.log(`Zalogowano użytkownika: ${user.login}`);
    return res.status(200).json({ token: appToken });

  } catch (error) {
    console.error('Google token verification error:', error);
    return res.status(401).json({ message: 'Invalid Google token' });
  }
});

app.get('/protected', verifyToken, (req: Request & { user?: Omit<User, 'password'> }, res: Response) => {
  return res.status(200).json({ user: req.user })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})


function generateToken(expirationInSeconds: number, user?: Omit<User, 'password'>): string {
  const exp = Math.floor(Date.now() / 1000) + expirationInSeconds
  const payload = user ? { exp, user } : { exp }
  return jwt.sign(payload, tokenSecret, { algorithm: 'HS256' })
}


function verifyToken(req: Request & { user?: Omit<User, 'password'> }, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1]

  if (!token) return res.sendStatus(403)

  jwt.verify(token, tokenSecret, (err, decoded) => {
    if (err) {
      return res.status(401).send(err.message)
    }

    if (typeof decoded === 'object' && 'user' in decoded) {
      req.user = decoded.user
      next()
    } else {
      return res.status(401).send('Invalid token payload')
    }
  })
}