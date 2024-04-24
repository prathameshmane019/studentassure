import Sidebar from "@/components/department";
  import { UserProvider } from "@/app/context/UserContext";
export default function RootLayout({ children }) {
  return (<div className="flex">
    <Sidebar/>
    <div className="w-full h-full" >
      <UserProvider>
        {children}
        </UserProvider>
      </div>
      </div>
  );
}