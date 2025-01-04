"use client";

import {
  CreateMultipleMusic,
  createMultipleMusicSchema,
} from "@/app/schemas/musicSchema";
import appendActionColumn from "@/app/utils/appendActionColumn";
import axiosClient from "@/axios";
import DeleteAlert from "@/components/DeleteAlert";
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
import MusicPopup from "./MusicPopup";

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
  const [isOpen, setIsOpen] = useState(false);
  const [music, setMusic] = useState<Music | null>(null);
  const [deleteAlert, setDeleteAlert] = useState(false);

  const { data, isLoading } = useQuery<MusicsResponse>({
    queryKey: ["musics", pagination],
    queryFn: () => axiosClient.get("/music").then((res) => res.data),
    staleTime: 1000 * 60 * 2, // 2 minutes
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

  // delete artist
  const { mutate: deleteMutate } = useMutation<
    BaseResponse,
    AxiosError<BaseErrorResponse>,
    number
  >({
    mutationFn: (id) =>
      axiosClient.delete(`/music/${id}`).then((res) => res.data),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    },
    onError: (error) => {
      console.log(error.message);
      toast.error(error.response?.data.message || "Failed to delete music");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["musics"] });
    },
  });

  const handleAdd = () => {
    setMusic(null);
    setIsOpen(true);
  };

  const handleEdit = (music: Music) => {
    setMusic(music);
    setIsOpen(true);
  };

  const handleDelete = (music: Music) => {
    setMusic(music);
  };

  const onDeleteMusic = () => {
    if (music && music.id) {
      deleteMutate(music.id);
    }
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
        <MusicPopup
          open={isOpen}
          setOpen={setIsOpen}
          music={music}
          setMusic={setMusic}
        />
        <DeleteAlert
          isOpen={deleteAlert}
          onOpenChange={setDeleteAlert}
          onDelete={onDeleteMusic}
          setState={setMusic}
        />
      </TableLayout>
    </PaginationTable>
  );
};

export default MusicsPage;
