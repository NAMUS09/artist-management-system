"use client";

import {
  CreateMultipleArtist,
  createMultipleArtistSchema,
} from "@/app/schemas/artistSchema";
import appendActionColumn from "@/app/utils/appendActionColumn";
import axiosClient from "@/axios";
import { PaginationTable } from "@/components/table/data-table";
import TableLayout from "@/components/TableLayout";
import {
  Artist,
  BaseErrorResponse,
  BaseResponse,
  PaginationResponse,
} from "@/lib/interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

type ArtistsResponse = BaseResponse &
  PaginationResponse & {
    artists: Artist[];
  };

const columns: ColumnDef<Artist>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: "Artist name",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "first_release_year",
    header: "First release year",
  },
  {
    accessorKey: "no_of_albums_released",
    header: "No. of albums released",
  },
];

const requiredKeys = [
  "name",
  "dob",
  "gender",
  "address",
  "first_release_year",
  "no_of_albums_released",
];

const ArtistsPage = () => {
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useQuery<ArtistsResponse>({
    queryKey: ["artists", pagination],
    queryFn: () => axiosClient.get("/artist").then((res) => res.data),
  });

  // handle bulk import
  const { mutate } = useMutation<
    BaseResponse,
    AxiosError<BaseErrorResponse>,
    CreateMultipleArtist
  >({
    mutationFn: (data) =>
      axiosClient.post("/artist/bulk", data).then((res) => res.data),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Artists imported successfully");
      } else {
        toast.error("Failed to import artists");
      }
    },
    onError: (error) => {
      console.log(error.message);
      toast.error(error.response?.data.message || "Failed to import artists");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["artists"] });
    },
  });

  const handleAdd = () => {
    // setIsOpen(true);
    // setArtist(null);
  };

  const handleEdit = (artist: Artist) => {
    console.log(artist);
    // setArtist(artist);
    // setIsOpen(true);
  };

  const handleDelete = (artist: Artist) => {
    console.log(artist);
  };

  const importArtists = (artists: { [key: string]: string }[]) => {
    const result = createMultipleArtistSchema.safeParse(artists);

    if (result.success) {
      mutate(result.data);
    } else {
      console.log(result.error);
      toast.error("Invalid data");
    }
  };

  const modifyColumns = appendActionColumn(columns, handleEdit, handleDelete);

  return (
    <PaginationTable
      pagination={pagination}
      setPagination={setPagination}
      totalPages={data?.pagination?.totalCount ?? 0}
    >
      <TableLayout
        heading="Artists"
        addText="Add Artist"
        data={data?.artists}
        isLoading={isLoading}
        handleAdd={handleAdd}
        fileName="artists.csv"
        columns={modifyColumns}
        requiredKeys={requiredKeys}
        handleImport={importArtists}
      >
        {/* <UserPopup
        open={isOpen}
        setOpen={setIsOpen}
        user={user}
        setUser={setUser}
      /> */}
      </TableLayout>
    </PaginationTable>
  );
};

export default ArtistsPage;
