import Header from "@/components/header";
import AppSidebar from "@/components/sidebar/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <main className="w-full h-full">
        <Header />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default MainLayout;
