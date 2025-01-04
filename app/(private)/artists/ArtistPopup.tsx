import { CreateArtist, createArtistSchema } from "@/app/schemas/artistSchema";
import axiosClient from "@/axios";
import DialogLayout from "@/components/DialogLayout";
import Button from "@/components/form/Button";
import FormDate from "@/components/form/FormDate";
import Input from "@/components/form/Input";
import Select from "@/components/form/Select";
import { Form } from "@/components/ui/form";
import { Artist, BaseErrorResponse, BaseResponse } from "@/lib/interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const ArtistPopup = ({
  open,
  setOpen,
  artist,
  setArtist,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  artist: Artist | null;
  setArtist: React.Dispatch<React.SetStateAction<Artist | null>>;
}) => {
  const queryClient = useQueryClient();

  const defaultValues = {
    name: "",
    dob: undefined,
    gender: undefined,
    address: "",
    first_release_year: "",
    no_of_albums_released: "",
  };

  const form = useForm<CreateArtist>({
    resolver: zodResolver(createArtistSchema),
    defaultValues,
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      setArtist(null);
    }
    setOpen(open);
  };

  useEffect(() => {
    if (artist) {
      form.setValue("name", artist.name);
      form.setValue("address", artist.address ?? "");
      form.setValue("gender", artist.gender);
      form.setValue("dob", new Date(artist.dob?.toString() ?? ""));
      form.setValue(
        "first_release_year",
        artist.first_release_year?.toString() ?? ""
      );
      form.setValue(
        "no_of_albums_released",
        artist.no_of_albums_released.toString() ?? ""
      );
    }
  }, [artist, form]);

  const { mutate, isPending } = useMutation<
    BaseResponse & Artist,
    AxiosError<BaseErrorResponse>,
    CreateArtist
  >({
    mutationFn: async (data) =>
      axiosClient.post("/artist/upsert", data).then((res) => res.data),
    onSuccess: (res) => {
      form.reset(defaultValues);
      toast.success(res.message);
      setArtist(null);
      handleOpenChange(false);
    },
    onError: (error) => {
      console.log(error.message);
      toast.error(error.response?.data.message || "Failed to create or update");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["artists"] });
    },
  });

  const onSubmit = async (data: CreateArtist) => {
    mutate({ ...data, id: artist?.id });
  };

  return (
    <DialogLayout
      open={open}
      isEdit={!!artist}
      title="Artist"
      handleOpenChange={handleOpenChange}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex-1 rounded-lg">
            <div className="w-full my-4 space-y-5">
              {/* Artist name */}
              <Input type="text" placeholder=" Name" form={form} name="name" />

              <div className="grid grid-cols-2 gap-2">
                {/* Gender */}
                <Select
                  form={form}
                  name="gender"
                  placeholder="Select gender"
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" },
                  ]}
                />
                {/* DOB */}
                <FormDate
                  form={form}
                  name="dob"
                  placeholder="Date of Birth"
                  className="w-full"
                />
              </div>
              {/* Address */}
              <Input
                type="text"
                placeholder="Address"
                form={form}
                name="address"
              />
              <Input
                type="text"
                placeholder="First Release Year"
                form={form}
                name="first_release_year"
              />
              <Input
                type="text"
                placeholder="Albums released"
                form={form}
                name="no_of_albums_released"
              />
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
                  {artist?.id ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </DialogLayout>
  );
};

export default ArtistPopup;
