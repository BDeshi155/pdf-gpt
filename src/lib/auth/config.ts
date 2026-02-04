import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabase, createServerClient } from '@/lib/supabase/client';
import { UserRole } from '@/types';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      image: string | null;
      role: UserRole;
      isAdmin: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    role: UserRole;
    isAdmin: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    isAdmin: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error || !data.user) {
          throw new Error('Invalid email or password');
        }

        // Fetch user profile from our profiles table
        const serverClient = createServerClient();
        const { data: profile } = await serverClient
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        return {
          id: data.user.id,
          email: data.user.email!,
          name: profile?.name || data.user.user_metadata?.name || null,
          image: profile?.avatar_url || data.user.user_metadata?.avatar_url || null,
          role: profile?.role || UserRole.FREE_USER,
          isAdmin: profile?.is_admin || false,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          const serverClient = createServerClient();
          
          // Check if user exists
          const { data: existingUser } = await serverClient
            .from('profiles')
            .select('id')
            .eq('email', user.email!)
            .single();

          if (!existingUser) {
            // Create user in Supabase auth if needed (for OAuth)
            const { data: authData, error: authError } = await serverClient.auth.admin.createUser({
              email: user.email!,
              email_confirm: true,
              user_metadata: {
                name: user.name,
                avatar_url: user.image,
                provider: account.provider,
              },
            });

            if (authError && !authError.message.includes('already registered')) {
              console.error('Error creating auth user:', authError);
              return false;
            }
          }

          return true;
        } catch (error) {
          console.error('SignIn error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isAdmin = user.isAdmin;
      }

      // Handle session update
      if (trigger === 'update' && session) {
        token.role = session.role;
        token.isAdmin = session.isAdmin;
      }

      // Refresh user data from database periodically
      if (token.id) {
        const serverClient = createServerClient();
        const { data: profile } = await serverClient
          .from('profiles')
          .select('role, is_admin')
          .eq('id', token.id)
          .single();

        if (profile) {
          token.role = profile.role;
          token.isAdmin = profile.is_admin;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
    newUser: '/dashboard',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
