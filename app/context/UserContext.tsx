"use client";

import { User } from "@/lib/interface";
import { createContext } from "react";
import usePersistedState from "../hooks/usePresistedState";

export type UserData = Pick<User, "id" | "email"> & {
  fullName: string;
  accessToken: string;
  expires: string;
};

type AuthContextType = {
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

const UserContext = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = usePersistedState<UserData | null>("user", null);

  return <AuthContext value={{ user, setUser }}>{children}</AuthContext>;
};

export default UserContext;
