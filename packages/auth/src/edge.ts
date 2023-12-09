import NextAuth from "next-auth"
import {baseAuthOptions} from "./index.ts";

export const {  auth } = NextAuth(baseAuthOptions)