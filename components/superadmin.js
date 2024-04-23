"use client"
import Image from "next/image";
import { CgProfile } from "react-icons/cg";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { GrCircleQuestion } from "react-icons/gr";
import { VscFeedback } from "react-icons/vsc";
import { TbReportAnalytics } from "react-icons/tb";
import { MdOutlineManageAccounts } from "react-icons/md";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation"; 
const sidebarItems = [
  {
    name: "Profile",
    href: "/super_admin/profile",
    icon: CgProfile,
  },
  {
    name: "Manage Feedback",
    href: "/super_admin/feedbacks",
    icon: VscFeedback,
  }, {
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
];

const Sidebar = () => {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebarcollapse = () => {
    setIsCollapsed((prevState) => !prevState);
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
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
