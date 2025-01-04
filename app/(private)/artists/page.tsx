"use client";

import {
  CreateMultipleArtist,
  createMultipleArtistSchema,
} from "@/app/schemas/artistSchema";
import appendActionColumn from "@/app/utils/appendActionColumn";
import axiosClient from "@/axios";
import DeleteAlert from "@/components/DeleteAlert";
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
import moment from "moment";
import { useState } from "react";
import toast from "react-hot-toast";
import ArtistPopup from "./ArtistPopup";

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
    accessorKey: "dob",
    header: "Date of birth",
    cell: ({ row }) => {
      const date = moment(row.original.dob).format("ll");
      return <span>{date}</span>;
    },
  },
  {
    accessorKey: "address",
    header: "Address",
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

  const [isOpen, setIsOpen] = useState(false);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [deleteAlert, setDeleteAlert] = useState(false);

  const { data, isLoading } = useQuery<ArtistsResponse>({
    queryKey: ["artists", pagination],
    queryFn: () => axiosClient.get("/artist").then((res) => res.data),
    staleTime: 1000 * 60 * 2, // 2 minutes
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
      queryClient.invalidateQueries({ queryKey: ["musics"] });
      queryClient.invalidateQueries({ queryKey: ["artists-dropdown"] });
    },
  });

  // delete artist
  const { mutate: deleteMutate } = useMutation<
    BaseResponse,
    AxiosError<BaseErrorResponse>,
    number
  >({
    mutationFn: (id) =>
      axiosClient.delete(`/artist/${id}`).then((res) => res.data),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    },
    onError: (error) => {
      console.log(error.message);
      toast.error(error.response?.data.message || "Failed to delete artist");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      queryClient.invalidateQueries({ queryKey: ["musics"] });
      queryClient.invalidateQueries({ queryKey: ["artists-dropdown"] });
    },
  });

  const handleAdd = () => {
    setArtist(null);
    setIsOpen(true);
  };

  const handleEdit = (artist: Artist) => {
    setArtist(artist);
    setIsOpen(true);
  };

  const handleDelete = (artist: Artist) => {
    setArtist(artist);
    setDeleteAlert(true);
  };

  const onDeleteArtist = () => {
    deleteMutate(artist?.id ?? 0);
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
        <ArtistPopup
          open={isOpen}
          setOpen={setIsOpen}
          artist={artist}
          setArtist={setArtist}
        />
        <DeleteAlert
          isOpen={deleteAlert}
          onOpenChange={setDeleteAlert}
          onDelete={onDeleteArtist}
          setState={setArtist}
        />
      </TableLayout>
    </PaginationTable>
  );
};

export default ArtistsPage;
