import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { Role } from "@/lib/interface";
import SidebarLink from "./SidebarLink";

type RouteType = {
  title: string;
  url: string;
  icon: string; // Pass icon name as a string
  roles: Role[];
};

// Menu items.
export const routes: RouteType[] = [
  {
    title: "Home",
    url: "/",
    icon: "Home",
    roles: ["super_admin"],
  },
  {
    title: "Users",
    url: "/users",
    icon: "Users",
    roles: ["super_admin"],
  },
  {
    title: "Artists",
    url: "/artists",
    icon: "ContactRound",
    roles: ["super_admin", "artist_manager"],
  },
  {
    title: "Musics",
    url: "/musics",
    icon: "Music",
    roles: ["super_admin", "artist_manager", "artist"],
  },
];

const AppSidebar = async () => {
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
                <SidebarLink
                  key={item.url}
                  title={item.title}
                  url={item.url}
                  icon={item.icon} // Pass icon name
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
