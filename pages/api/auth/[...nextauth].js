import NextAuth from "next-auth/next";
import CredentialProvider from "next-auth/providers/credentials";
export default NextAuth({
  providers: [
    CredentialProvider({
      name: "credentials",
      credentials: {
        username: {
          type: "text",
          label: "email",
          placeholder: "ex@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const payload = {
          username: credentials.username,
          password: credentials.password,
        };

        const res = await fetch("http://localhost:8000/login", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const user = await res.json();
        if (!res.ok) {
          throw new Error(user.exception);
        }
        if (res.ok && user) {
          return user;
        }

        // login failed
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  refetchInterval: 5,
  session: {
    strategy: "jwt",
    maxAge: 60,
  },
  jwt: {
    maxAge: 60,
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      // first time jwt callback is run, user object is available
      if (user) {
        token.access_token = user.access_token;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.access_token = token.access_token;
      }
      return session;
    },
  },
  secret: "test",
  jwt: {
    secret: "test",
    encryption: true,
  },
});
