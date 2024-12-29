"use client";

import Link from "next/link";

import { Form } from "@/components/ui/form";

import { userRegisterSchema, UserRegisterSchema } from "@/app/schemas/auth";
import axiosClient from "@/axios";
import Button from "@/components/form/Button";
import FormDate from "@/components/form/FormDate";
import Input from "@/components/form/Input";
import PasswordInput from "@/components/form/PasswordInput";
import Select from "@/components/form/Select";
import { BaseErrorResponse, BaseResponse, User } from "@/lib/interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const router = useRouter();
  const form = useForm<UserRegisterSchema>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
    },
  });

  const { mutate, isPending } = useMutation<
    BaseResponse & User,
    AxiosError<BaseErrorResponse>,
    UserRegisterSchema
  >({
    mutationFn: async (data) =>
      axiosClient.post("/auth/register", data).then((res) => res.data),
    onSuccess: (res) => {
      console.log(res);
      form.reset();
      toast.success(res.message);
      router.push("/login");
    },
    onError: (error) => {
      console.log(error.message);
      toast.error(error.response?.data.message || "Failed to register");
    },
  });

  const onSubmit = async (data: UserRegisterSchema) => {
    mutate(data);
  };
  return (
    <>
      <Form {...form}>
        <h1 className=" text-2xl my-2 text-center">Create an account</h1>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex-1 rounded-lg ">
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
              <PasswordInput form={form} />

              <Button
                type="submit"
                isLoading={isPending || form.formState.isSubmitting}
                className="mt-2 w-full"
              >
                Register
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <div className="flex justify-center my-2">
        <p className="text-sm">
          {"Already have an account? "}
          <Link href="/login" className="text-primary hover:underline">
            {"Login here"}
          </Link>
        </p>
      </div>
    </>
  );
};

export default RegisterPage;
