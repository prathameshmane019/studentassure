import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "@/lib/connectDb"
import Department from '@/models/department';

export const authOptions = ({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials) {
        try {
          await connectMongoDB();
          const Id = credentials.userId;
          const password = credentials.password;
          let userRole;
          let id;
          let classes;
          let departmentName; 
          console.log(credentials);
          const department = await Department.findOne({ _id: Id });

          console.log(department);
          if (department) {
            userRole = "department";
            id = department._id;
            classes = department.classes;
            departmentName = department.department; // Extract department name
            console.log(classes);
          }
          else {
            return null;
          }
      
          const isVerified = (department && department.password === password) ||(admin && admin.password === password);
          console.log(isVerified);
          if (isVerified) {
            const userWithRole = {
              ...department?.toObject(), // Optional chaining to prevent errors if user is null
              role: userRole,
              id: id,
              classes: classes,
              department: departmentName // Add department name to user object
            };
            return Promise.resolve(userWithRole);
          } else {
            return null; // Return null if credentials are invalid
          }
        } catch (error) {
          console.error('Error during authorization:', error);
          return null;
        }
      }
    }),
  ],
  session: {
    sessionCallback: async (session, user) => {
      session.user = { ...user, role: user.role, id: user.id, classes: user.classes, department: user.department }; // Add department name to the session
      return Promise.resolve(session);
    },
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.role = user.role;
        token.id = user.id;
        token.classes = user.classes;
        token.department = user.department; // Add department name to the token
      }
      return token;
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.role = token.role;
      session.user.id = token.id;
      session.user.classes = token.classes;
      session.user.department = token.department; // Add department name to the session
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/", // Customize the sign-in page route as needed
  },
});

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
