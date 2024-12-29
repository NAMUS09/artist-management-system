import Image from "next/image";

import { getCurrentUser } from "@/lib/auth";
import { SidebarTrigger } from "../ui/sidebar";
import Logout from "./Logout";

const Header = async () => {
  const user = await getCurrentUser();
  return (
    <div className="flex shadow-md p-2 items-center justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Image src="/header-logo.jpeg" alt="Logo" width={25} height={25} />
        <h1 className="font-bold text-lg">Artist Managment System</h1>
      </div>
      <div className="flex items-center gap-4">
        <h1 className="font-bold text-lg">Welcome, {user?.name}</h1>
        <Logout />
      </div>
    </div>
  );
};

export default Header;
