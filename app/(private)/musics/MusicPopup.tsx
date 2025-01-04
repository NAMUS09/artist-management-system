import {
  CreateMusicFromId,
  createMusicSchemaFromId,
} from "@/app/schemas/musicSchema";
import axiosClient from "@/axios";
import DialogLayout from "@/components/DialogLayout";
import Button from "@/components/form/Button";
import Input from "@/components/form/Input";
import Select from "@/components/form/Select";
import { Form } from "@/components/ui/form";
import {
  Artist,
  BaseErrorResponse,
  BaseResponse,
  Music,
  PaginationResponse,
} from "@/lib/interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type ArtistsResponse = BaseResponse &
  PaginationResponse & {
    artists: Artist[];
  };

const MusicPopup = ({
  open,
  setOpen,
  music,
  setMusic,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  music: Music | null;
  setMusic: React.Dispatch<React.SetStateAction<Music | null>>;
}) => {
  const queryClient = useQueryClient();

  const defaultValues = {
    artist_id: "",
    title: "",
    album_name: "",
    genre: undefined,
  };

  const form = useForm<CreateMusicFromId>({
    resolver: zodResolver(createMusicSchemaFromId),
    defaultValues,
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      setMusic(null);
    }
    setOpen(open);
  };

  useEffect(() => {
    if (music) {
      form.setValue("artist_id", music.artist_id.toString());
      form.setValue("title", music.title);
      form.setValue("album_name", music.album_name);
      form.setValue("genre", music.genre);
    }
  }, [music, form]);

  const { data } = useQuery<ArtistsResponse>({
    queryKey: ["artists-dropdown"],
    queryFn: () => axiosClient.get("/artist").then((res) => res.data),
    staleTime: 1000 * 60 * 2,
  });

  const { mutate, isPending } = useMutation<
    BaseResponse & Music,
    AxiosError<BaseErrorResponse>,
    CreateMusicFromId
  >({
    mutationFn: async (data) =>
      axiosClient.post("/music/upsert", data).then((res) => res.data),
    onSuccess: (res) => {
      form.reset(defaultValues);
      toast.success(res.message);
      setMusic(null);
      handleOpenChange(false);
    },
    onError: (error) => {
      console.log(error.message);
      toast.error(error.response?.data.message || "Failed to create or update");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["musics"] });
    },
  });

  const onSubmit = async (data: CreateMusicFromId) => {
    console.log(data);
    mutate({ ...data, id: music?.id });
  };

  const genreOptions = [
    { value: "rnb", label: "R&B" },
    { value: "country", label: "Country" },
    { value: "classic", label: "Classic" },
    { value: "rock", label: "Rock" },
    { value: "jazz", label: "Jazz" },
  ];

  return (
    <DialogLayout
      open={open}
      isEdit={!!music}
      title="Music"
      handleOpenChange={handleOpenChange}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex-1 rounded-lg">
            <div className="w-full my-4 space-y-5">
              {/* Music name */}
              <Input type="text" placeholder="Title" form={form} name="title" />
              {/* Music album */}
              <Input
                type="text"
                placeholder="Album name"
                form={form}
                name="album_name"
              />

              <div className="grid grid-cols-2 gap-2">
                {/* Artist */}
                <Select
                  form={form}
                  name="artist_id"
                  placeholder="Select artist"
                  options={
                    data?.artists.map((artist) => ({
                      value: artist.id!.toString(),
                      label: artist.name,
                    })) ?? []
                  }
                />
                {/* Genre */}
                <Select
                  form={form}
                  name="genre"
                  placeholder="Select genre"
                  options={genreOptions}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  variant={"outline"}
                  type="button"
                  className="mt-2 w-full"
                  onClick={() => handleOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isPending || form.formState.isSubmitting}
                  className="mt-2 w-full"
                >
                  {music?.id ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </DialogLayout>
  );
};

export default MusicPopup;
