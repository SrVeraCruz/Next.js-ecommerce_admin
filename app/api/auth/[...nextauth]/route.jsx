import NextAuth, { getServerSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../../../../lib/mongodb"

const adminEmails = ['veracruzdudu@gmail.com']

const authOption = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: ({session}) => {
      if (adminEmails.includes(session?.user?.email)) {
        return session
      } else {
        return false
      }
    }
  }
}

export default NextAuth(authOption);

// export const isAdminRequest = async () => {
//   const session = await getServerSession(authOption)
//   if(!adminEmails.includes(session?.user?.email)) {
//     const error = new Error('Not authorized! Admin only.')
//     error.status = 401;
//     throw error
//   }
// }