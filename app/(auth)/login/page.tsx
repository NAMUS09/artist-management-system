"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";

import { AuthContext } from "@/app/context/UserContext";
import { UserLoginSchema, userLoginSchema } from "@/app/schemas/auth";
import axiosClient from "@/axios";
import Button from "@/components/form/Button";
import Input from "@/components/form/Input";
import PasswordInput from "@/components/form/PasswordInput";
import { BaseErrorResponse, BaseResponse, User } from "@/lib/interface";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { use } from "react";
import toast from "react-hot-toast";

type Response = {
  accessToken: string;
  expires: string;
  user: Pick<User, "id" | "email"> & {
    name: string;
  };
};

type LoginResponse = BaseResponse & Response;

const LoginPage = () => {
  const authContext = use(AuthContext);

  if (!authContext) throw new Error("AuthContext not found");

  const router = useRouter();
  const form = useForm<UserLoginSchema>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { setUser } = authContext;

  const { mutate, isPending } = useMutation<
    LoginResponse,
    AxiosError<BaseErrorResponse>,
    UserLoginSchema
  >({
    mutationFn: async (data) =>
      axiosClient.post("/auth/login", data).then((res) => res.data),
    onSuccess: (res) => {
      form.reset();
      toast.success(res.message);
      const { accessToken, expires, user } = res;
      const userData = {
        id: user.id!,
        email: user.email,
        name: user.name,
        accessToken,
        expires,
      };
      setUser(userData);
      router.push("/");
    },
    onError: (error) => {
      console.log(error.message);
      toast.error(error.response?.data.message || "Failed to login");
    },
  });

  const onSubmit = async (data: UserLoginSchema) => {
    mutate(data);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex-1 rounded-lg">
            <div className="flex flex-col justify-center items-center">
              <Image
                className="rounded-full"
                src="/logo.webp"
                alt="logo"
                width={150}
                height={150}
              />
              <h1 className=" text-2xl mt-2">Welcome back!</h1>
            </div>

            <div className="w-full my-4 space-y-5">
              {/* Email */}
              <Input
                type="email"
                placeholder="Email address or phone number"
                form={form}
                name="email"
                disabled={form.formState.isSubmitting}
              />
              {/* Password */}
              <PasswordInput form={form} />

              <Button
                type="submit"
                isLoading={isPending || form.formState.isSubmitting}
                className="mt-2 w-full"
              >
                Log in
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <div className="flex justify-center my-2">
        <p className="text-sm">
          {"Don't have an account? "}
          <Link href="/register" className="text-primary hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </>
  );
};

export default LoginPage;
