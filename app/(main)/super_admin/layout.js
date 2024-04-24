import Sidebar from "@/components/superadmin";

export default function RootLayout({ children }) {
  return (<div className="flex">
    <Sidebar/>
    <div className="w-full  h-screen overflow-y-auto" >
        {children}
      </div>
      </div>
  );
}
