"use client";

import appendActionColumn from "@/app/utils/appendActionColumn";
import axiosClient from "@/axios";
import TableLayout from "@/components/TableLayout";
import { Artist, BaseResponse } from "@/lib/interface";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";

type ArtistsResponse = BaseResponse & {
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

const ArtistsPage = () => {
  // const [artist, setArtist] = useState<Artist | null>(null);
  // const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useQuery<ArtistsResponse>({
    queryKey: ["artists"],
    queryFn: () => axiosClient.get("/artist").then((res) => res.data),
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

  const modifyColumns = appendActionColumn(columns, handleEdit, handleDelete);

  return (
    <TableLayout
      heading="Artists"
      addText="Add Artist"
      data={data?.artists}
      isLoading={isLoading}
      handleAdd={handleAdd}
      fileName="artists.csv"
      columns={modifyColumns}
    >
      {/* <UserPopup
        open={isOpen}
        setOpen={setIsOpen}
        user={user}
        setUser={setUser}
      /> */}
    </TableLayout>
  );
};

export default ArtistsPage;
