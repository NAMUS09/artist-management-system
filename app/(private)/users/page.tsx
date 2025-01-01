"use client";

import appendActionColumn, {
  SortColumnDef,
} from "@/app/utils/appendActionColumn";
import axiosClient from "@/axios";

import {
  CreateMultipleUser,
  createMultipleUserSchema,
} from "@/app/schemas/userSchema";
import { PaginationTable } from "@/components/table/DataTablePagination";
import TableLayout from "@/components/TableLayout";
import {
  BaseErrorResponse,
  BaseResponse,
  PaginationResponse,
  User,
} from "@/lib/interface";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
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
  const [pageSize, setPageSize] = useState(10);
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // get users
  const {
    data,
    isRefetching,
    isLoading,
    fetchNextPage,
    hasNextPage,
    fetchPreviousPage,
  } = useInfiniteQuery<UsersResponse>({
    queryKey: ["users", "infinite", pageSize],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      axiosClient
        .get("/user", { params: { limit: pageSize, page: pageParam } })
        .then((res) => res.data),
    getPreviousPageParam: (firstPage) => firstPage.pagination.currentPage - 1,
    getNextPageParam: (lastPage) => lastPage.pagination.currentPage + 1,
  });

  // handle bulk import
  const { mutate } = useMutation<
    BaseResponse,
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

  const handleAdd = () => {
    setIsOpen(true);
    setUser(null);
  };

  const handleEdit = (user: User) => {
    setUser(user);
    setIsOpen(true);
  };

  const handleDelete = (user: User) => {
    console.log(user);
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

  const flattenData = data?.pages.map((page) => page.users).flat();

  return (
    <PaginationTable
      setPageSize={setPageSize}
      fetchNextPage={fetchNextPage}
      fetchPreviousPage={fetchPreviousPage}
      hasNextPage={hasNextPage}
    >
      <TableLayout
        heading="Users"
        addText="Add User"
        data={flattenData}
        isLoading={isLoading || isRefetching}
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
      </TableLayout>
    </PaginationTable>
  );
};

export default UsersPage;
