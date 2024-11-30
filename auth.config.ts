import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.user.id = user.id
      
      return session
    },
   
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
