"use client"
import Image from "next/image";
import { CgProfile } from "react-icons/cg";
import {  RxExit } from "react-icons/rx";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { GrCircleQuestion } from "react-icons/gr";
import { VscFeedback } from "react-icons/vsc";
import { TbReportAnalytics } from "react-icons/tb";
import { MdOutlineManageAccounts } from "react-icons/md";
import Link from "next/link";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation"; 
const sidebarItems = [
  {
    name: "Profile",
    href: "/super_admin",
    icon: CgProfile,
  },
  {
    name: "Manage Questions",
    href: "/super_admin/questions",
    icon: GrCircleQuestion,
  },
  {
    name: "Manage Departments",
    href: "/super_admin/departments",
    icon: MdOutlineManageAccounts,
  },
  {
    name: "Evaluate",
    href: "/super_admin/evaluate",
    icon: TbReportAnalytics,
  },
  {
    name: "Manage Feedback",
    href: "/super_admin/feedbacks",
    icon: VscFeedback,
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
                    <Icon className="inline-block mx-auto" />
                  </span>
                  <span className="sidebar__name">{name}</span>
                </Link>
              </li>
            );
          })}
           <button onClick={handleSignOut} color="primary" width="30"  >
           <RxExit className="w-5 h-5 ml-3 my-2 " />
              </button>
        </ul>
      </aside>
    </div>
  );
};
export default Sidebar;