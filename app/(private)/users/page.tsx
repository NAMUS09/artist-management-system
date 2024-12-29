"use client";

import appendActionColumn from "@/app/utils/appendActionColumn";
import axiosClient from "@/axios";
import TableLayout from "@/components/TableLayout";
import { BaseResponse, User } from "@/lib/interface";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import UserPopup from "./UserPopup";

type UsersResponse = BaseResponse & {
  users: User[];
};

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "first_name",
    header: "First name",
  },
  {
    accessorKey: "last_name",
    header: "Last name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
];

const UsersPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useQuery<UsersResponse>({
    queryKey: ["users"],
    queryFn: () => axiosClient.get("/user").then((res) => res.data),
  });

  const handleAdd = () => {
    setIsOpen(true);
    setUser(null);
  };

  const handleEdit = (user: User) => {
    console.log(user);
    setUser(user);
    setIsOpen(true);
  };

  const handleDelete = (user: User) => {
    console.log(user);
  };

  const modifyColumns = appendActionColumn(columns, handleEdit, handleDelete);

  return (
    <TableLayout
      heading="Users"
      addText="Add User"
      data={data?.users}
      isLoading={isLoading}
      handleAdd={handleAdd}
      fileName="users.csv"
      columns={modifyColumns}
    >
      <UserPopup
        open={isOpen}
        setOpen={setIsOpen}
        user={user}
        setUser={setUser}
      />
    </TableLayout>
  );
};

export default UsersPage;
