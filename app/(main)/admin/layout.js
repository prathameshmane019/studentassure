import Sidebar from "@/components/department";
import { getServerSession } from "next-auth";
import { UserProvider } from "@/app/context/UserContext";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role
 
  if (!(role==="department")) {
    console.log("unauthorised")
    redirect("/login");
   }
  return (<div className="flex">
    <Sidebar/>
    <div className="w-full h-screen overflow-y-auto" >
      <UserProvider>
        {children}
        </UserProvider>
      </div> 
      </div>
  );
}
