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
        // ✅ Simplified - just enrich token with user data
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.shopifyCustomerId = user.shopifyCustomerId || null;
            }
            return token;
        },

        // ✅ Expose token data to client session
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
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