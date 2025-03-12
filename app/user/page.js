"use client";

import MenuPage from "../_components/menu";
import UserProfile from "./userprofile/page";
import { useRouter, usePathname } from "next/navigation";


export default function user() {
 const pathname = usePathname();

  return (
    <>
        <MenuPage/>
        {pathname === "/user/userprofile" ? <UserProfile /> : null}
    </>
  );
}
