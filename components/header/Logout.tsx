"use client";

import axiosClient from "@/axios";

import { useMutation } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

const Logout = () => {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async () =>
      axiosClient.get("/auth/logout").then((res) => res.data),
    onSuccess: () => {
      toast.success("Logout successful");
      router.push("/login");
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });

  return (
    <Button onClick={() => mutate()}>
      <LogOut />
      {isPending ? "Loading..." : "Logout"}
    </Button>
  );
};

export default Logout;
