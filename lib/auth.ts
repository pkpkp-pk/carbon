import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { generateGrnId } from '@/lib/grn'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null
        const username = credentials.username as string
        const password = credentials.password as string

        let user = await prisma.user.findUnique({ where: { username } })

        if (!user) {
          // Register new user
          const hash = await bcrypt.hash(password, 12)
          user = await prisma.user.create({
            data: {
              username,
              password_hash: hash,
              grn_id: generateGrnId(),
              is_guest: false,
            },
          })
        } else {
          // Validate password
          const valid = await bcrypt.compare(password, user.password_hash ?? '')
          if (!valid) return null
        }

        return { id: user.id, name: user.username }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    jwt({ token, user }) {
      if (user) { token.id = user.id }
      return token
    },
    session({ session, token }) {
      if (session.user) { (session.user as any).id = token.id }
      return session
    },
  },
  pages: { signIn: '/login' },
})
