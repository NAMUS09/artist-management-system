import { UserRegisterSchema, userRegisterSchema } from "@/app/schemas/auth";
import axiosClient from "@/axios";
import Button from "@/components/form/Button";
import FormDate from "@/components/form/FormDate";
import Input from "@/components/form/Input";
import PasswordInput from "@/components/form/PasswordInput";
import Select from "@/components/form/Select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { BaseErrorResponse, BaseResponse, User } from "@/lib/interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const UserPopup = ({
  open,
  setOpen,
  user,
  setUser,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}) => {
  const queryClient = useQueryClient();

  const form = useForm<UserRegisterSchema>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      dob: null,
      gender: undefined,
      role: undefined,
    },
  });

  const { mutate, isPending } = useMutation<
    BaseResponse & User,
    AxiosError<BaseErrorResponse>,
    UserRegisterSchema
  >({
    mutationFn: async (data) =>
      axiosClient.post("/user/upsert", data).then((res) => res.data),
    onSuccess: (res) => {
      form.reset();
      toast.success(res.message);
      handleOpenChange(false);
    },
    onError: (error) => {
      console.log(error.message);
      toast.error(error.response?.data.message || "Failed to create or update");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      setUser(null);
    }
    setOpen(open);
  };

  useEffect(() => {
    if (user) {
      form.setValue("first_name", user.first_name);
      form.setValue("last_name", user.last_name);
      form.setValue("email", user.email);
      form.setValue("phone", user.phone);
      form.setValue("address", user.address);
      form.setValue("gender", user.gender);
      form.setValue("role", user.role);
      form.setValue("dob", new Date(user.dob));
    }
  }, [user, form]);

  const onSubmit = async (data: UserRegisterSchema) => {
    console.log(data);
    mutate({ ...data, id: user?.id });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{user?.id ? "Edit" : "Add"} user</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex-1 rounded-lg">
              <div className="w-full my-4 space-y-5">
                <div className="grid grid-cols-2 gap-2">
                  {/* First Name */}
                  <Input
                    type="text"
                    placeholder="First Name"
                    form={form}
                    name="first_name"
                  />
                  {/* Last Name */}
                  <Input
                    type="text"
                    placeholder="Last Name"
                    form={form}
                    name="last_name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
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
                  <Select
                    form={form}
                    name="role"
                    placeholder="Select role"
                    options={[
                      { value: "super_admin", label: "Super Admin" },
                      { value: "artist_manager", label: "Artist Manager" },
                      { value: "artist", label: "Artist" },
                    ]}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {/* DOB */}
                  <FormDate
                    form={form}
                    name="dob"
                    placeholder="Date of Birth"
                    className="w-full"
                  />
                  {/* Phone */}
                  <Input
                    type="text"
                    placeholder="Phone"
                    form={form}
                    name="phone"
                  />
                </div>
                {/* Address */}
                <Input
                  type="text"
                  placeholder="Address"
                  form={form}
                  name="address"
                />
                {/* Email */}
                <Input
                  type="email"
                  placeholder="Email"
                  form={form}
                  name="email"
                />
                {/* Password */}
                <PasswordInput form={form} name="password" />

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
                    {user?.id ? "Update" : "Create"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserPopup;
