"use client";

import {
  CreateMultipleMusic,
  createMultipleMusicSchema,
} from "@/app/schemas/musicSchema";
import appendActionColumn from "@/app/utils/appendActionColumn";
import axiosClient from "@/axios";
import { PaginationTable } from "@/components/table/data-table";
import TableLayout from "@/components/TableLayout";
import {
  BaseErrorResponse,
  BaseResponse,
  Music,
  PaginationResponse,
} from "@/lib/interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

type MusicsResponse = BaseResponse &
  PaginationResponse & {
    musics: Music[];
  };

const columns: ColumnDef<Music>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "artist_name",
    header: "Artist name",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "album_name",
    header: "Album name",
  },
  {
    accessorKey: "genre",
    header: "Genre",
  },
];

const requiredKeys = ["artist_name", "title", "album_name", "genre"];

const MusicsPage = () => {
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useQuery<MusicsResponse>({
    queryKey: ["musics", pagination],
    queryFn: () => axiosClient.get("/music").then((res) => res.data),
  });

  // handle bulk import
  const { mutate } = useMutation<
    BaseResponse,
    AxiosError<BaseErrorResponse>,
    CreateMultipleMusic
  >({
    mutationFn: (data) =>
      axiosClient.post("/music/bulk", data).then((res) => res.data),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Musics imported successfully");
      } else {
        toast.error("Failed to import musics");
      }
    },
    onError: (error) => {
      console.log(error.message);
      toast.error(error.response?.data.message || "Failed to import musics");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["musics"] });
    },
  });

  const handleAdd = () => {
    // setIsOpen(true);
    // setArtist(null);
  };

  const handleEdit = (music: Music) => {
    console.log(music);
    // setArtist(artist);
    // setIsOpen(true);
  };

  const handleDelete = (music: Music) => {
    console.log(music);
  };

  const importMusics = (musics: { [key: string]: string }[]) => {
    const result = createMultipleMusicSchema.safeParse(musics);

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
      totalPages={data?.pagination?.totalCount ?? 0}
    >
      <TableLayout
        heading="Musics"
        addText="Add Music"
        data={data?.musics ?? []}
        isLoading={isLoading}
        handleAdd={handleAdd}
        fileName="musics.csv"
        columns={modifyColumns}
        requiredKeys={requiredKeys}
        handleImport={importMusics}
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

export default MusicsPage;
