import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '@/lib/prisma'
import { generateGrnId } from '@/lib/grn'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null

        // Dummy simple auth for now (since we don't have bcrypt setup)
        // Check if user exists
        let user = await prisma.user.findUnique({
          where: { username: credentials.username as string }
        })

        if (!user) {
          // If user doesn't exist, register them (simple flow)
          user = await prisma.user.create({
            data: {
              username: credentials.username as string,
              password_hash: credentials.password as string, // WARNING: Not hashed for simplicity in this demo
              grn_id: generateGrnId(),
              is_guest: false
            }
          })
        } else {
          // Validate password
          if (user.password_hash !== credentials.password) return null
        }

        return { id: user.id, name: user.username }
      }
    })
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  }
})
