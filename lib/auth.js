import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import NextAuth from "next-auth";
import { compare } from "bcryptjs";

import { connectToDatabase } from "./mongoose";
import User from "@/models/User";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),

        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        }),

        // Username + password login
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username or Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectToDatabase();

                const { username, password } = credentials;

                if (!username || !password) return null;

                // Allow login with either email or username
                const user = await User.findOne({
                    $or: [{ email: username }, { username }],
                }).lean();

                if (!user || !user.passwordHash) {
                    return null;
                }

                const isValid = await compare(password, user.passwordHash);
                if (!isValid) {
                    return null;
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.username || user.email,
                    shopifyCustomerId: user.shopifyCustomerId || null,
                };
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user }) {
            // Runs on every JWT operation
            // `user` is only defined right after sign-in
            if (user) {
                await connectToDatabase();

                const email = user.email || token.email;
                if (!email) return token;

                // Find or create Mongo user for *any* provider (credentials / Google / GitHub)
                let dbUser = await User.findOne({ email });

                if (!dbUser) {
                    dbUser = await User.create({
                        email,
                        username: user.name || user.username || email.split("@")[0],
                        // you can add other defaults if your schema needs them
                    });
                }

                // IMPORTANT: use our own field, don't fight with NextAuth's internal `sub`
                token.userId = dbUser._id.toString();
                token.shopifyCustomerId = dbUser.shopifyCustomerId || null;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                // Prefer our Mongo id if present, otherwise fall back to provider id
                if (token.userId) {
                    session.user.id = token.userId;
                } else if (token.sub) {
                    session.user.id = token.sub;
                }

                session.user.shopifyCustomerId = token.shopifyCustomerId || null;
            }
            return session;
        },
    },

    pages: {
        signIn: "/auth/login",
    },
};

export const authHandler = NextAuth(authOptions);