"use client";

import appendActionColumn, {
  SortColumnDef,
} from "@/app/utils/appendActionColumn";
import axiosClient from "@/axios";

import {
  CreateMultipleUser,
  createMultipleUserSchema,
} from "@/app/schemas/userSchema";

import DeleteAlert from "@/components/DeleteAlert";
import { PaginationTable } from "@/components/table/data-table";
import TableLayout from "@/components/TableLayout";
import {
  BaseErrorResponse,
  BaseResponse,
  PaginationResponse,
  User,
} from "@/lib/interface";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import UserPopup from "./UserPopup";

type UsersResponse = BaseResponse &
  PaginationResponse & {
    users: User[];
  };

const columns: SortColumnDef<User>[] = [
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
    sortable: false,
  },
];

const requiredKeys = [
  "first_name",
  "last_name",
  "email",
  "password",
  "role",
  "phone",
  "dob",
  "gender",
  "address",
];

const UsersPage = () => {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);

  const { data, isLoading } = useQuery<UsersResponse>({
    queryKey: ["users", pagination],
    queryFn: () =>
      axiosClient
        .get("/user", {
          params: {
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
          },
        })
        .then((res) => res.data),
    placeholderData: keepPreviousData,
  });

  // handle bulk import
  const { mutate } = useMutation<
    BaseResponse & { data: User[] },
    AxiosError<BaseErrorResponse>,
    CreateMultipleUser
  >({
    mutationFn: (data) =>
      axiosClient.post("/user/bulk", data).then((res) => res.data),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Users imported successfully");
      } else {
        toast.error("Failed to import users");
      }
    },
    onError: (error) => {
      console.log(error.message);
      toast.error(error.response?.data.message || "Failed to import users");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // delete artist
  const { mutate: deleteMutate } = useMutation<
    BaseResponse,
    AxiosError<BaseErrorResponse>,
    number
  >({
    mutationFn: (id) =>
      axiosClient.delete(`/user/${id}`).then((res) => res.data),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    },
    onError: (error) => {
      console.log(error.message);
      toast.error(error.response?.data.message || "Failed to delete user");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleAdd = () => {
    setUser(null);
    setIsOpen(true);
  };

  const handleEdit = (user: User) => {
    setUser(user);
    setIsOpen(true);
  };

  const handleDelete = (user: User) => {
    setUser(user);
    setDeleteAlert(true);
  };

  const onDeleteUser = () => {
    if (user) {
      deleteMutate(user.id!);
    }
  };

  const importUsers = (users: { [key: string]: string }[]) => {
    const result = createMultipleUserSchema.safeParse(users);

    if (result.success) {
      mutate(result.data);
    } else {
      toast.error("Invalid data");
    }
  };

  const modifyColumns = appendActionColumn(columns, handleEdit, handleDelete);

  return (
    <PaginationTable
      pagination={pagination}
      setPagination={setPagination}
      totalPages={data?.pagination.totalCount ?? 0}
    >
      <TableLayout
        heading="Users"
        addText="Add User"
        data={data?.users ?? []}
        isLoading={isLoading}
        handleAdd={handleAdd}
        fileName="users.csv"
        columns={modifyColumns}
        requiredKeys={requiredKeys}
        handleImport={importUsers}
      >
        <UserPopup
          open={isOpen}
          setOpen={setIsOpen}
          user={user}
          setUser={setUser}
        />
        <DeleteAlert
          isOpen={deleteAlert}
          onOpenChange={setDeleteAlert}
          onDelete={onDeleteUser}
        />
      </TableLayout>
    </PaginationTable>
  );
};

export default UsersPage;
