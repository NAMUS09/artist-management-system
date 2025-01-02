import { ContactRound, Home, LucideIcon, Music, Users } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { Role } from "@/lib/interface";
import { headers } from "next/headers";
import Link from "next/link";

type RouteType = {
  title: string;
  url: string;
  icon: LucideIcon;
  roles: Role[];
};

// Menu items.
export const routes: RouteType[] = [
  {
    title: "Home",
    url: "/",
    icon: Home,
    roles: ["super_admin"],
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
    roles: ["super_admin"],
  },
  {
    title: "Artists",
    url: "/artists",
    icon: ContactRound,
    roles: ["super_admin", "artist_manager"],
  },
  {
    title: "Musics",
    url: "/musics",
    icon: Music,
    roles: ["super_admin", "artist_manager", "artist"],
  },
];

const AppSidebar = async () => {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");
  const currentUser = await getCurrentUser();
  const role = currentUser?.role;

  // Filter items based on the user's role.
  const filteredItems = role
    ? routes.filter((item) => item.roles.includes(role))
    : [];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Link href={item.url}>
                    <SidebarMenuButton isActive={item.url === pathname}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
