"use client"
import Image from "next/image";
import { CgProfile } from "react-icons/cg";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { GrCircleQuestion } from "react-icons/gr";
import { VscFeedback } from "react-icons/vsc";
import { TbReportAnalytics } from "react-icons/tb";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation"; 
const sidebarItems = [
  {
    name: "Profile",
    href: "/admin",
    icon: CgProfile,
  },
  {
    name: "Manage Feedback",
    href: "/admin/feedbacks",
    icon: VscFeedback,
  }, 
  {
    name: "Evaluate",
    href: "/admin/evaluate",
    icon: TbReportAnalytics,
  },
];

const Sidebar = () => {
  
const router = useRouter()

  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebarcollapse = () => {
    setIsCollapsed((prevState) => !prevState);
  };
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.replace("/");
  };

  return (
    <div className={`h-screen sidebar__wrapper ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="btn shadow-xl " onClick={toggleSidebarcollapse}>
        {isCollapsed ? <MdKeyboardArrowRight  className=" "/> : <MdKeyboardArrowLeft />}
      </button>
      <aside className="sidebar rounded-r-lg shadow-2xl bg-primary-500  text-gray-100" data-collapse={isCollapsed}>
        <div className="sidebar__top  text-primary ">
          <Image
            width={80}
            height={80}
            className="sidebar__logo rounded-full"
            src="/logo.png"
            alt="logo"
          />
          <p className="sidebar__logo-name">Student Assure</p>
        </div>
        <ul className="sidebar__list text-slate-900 dark:text-slate-50">
          {sidebarItems.map(({ name, href, icon: Icon }) => {
            return (
              <li className="sidebar__item items-center" key={name}>
                <Link
                  className={`sidebar__link ${pathname === href ? "sidebar__link--active" : ""}`}
                  href={href}
                >
                  <span className="sidebar__icon">
                    <Icon className="inline-block mr-2" />
                  </span>
                  <span className="sidebar__name">{name}</span>
                </Link>
              </li>
            );
          })}
            <Button onClick={handleSignOut} color="primary" variant="flat">
                Log Out
              </Button>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
