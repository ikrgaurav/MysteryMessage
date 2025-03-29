"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { useForm } from "react-hook-form";

function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const [username, setUsername] = useState<string>("");

  // Initialize username with proper decoding
  useEffect(() => {
    // Make sure the username is properly decoded
    if (params.username) {
      const decodedUsername = decodeURIComponent(params.username);
      setUsername(decodedUsername);
    }
  }, [params.username]);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: username,
        code: data.code,
      });

      toast("Success", {
        description: response.data.message,
      });

      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast("Sign up failed", {
        description:
          axiosError.response?.data.message ||
          "An error occurred during verification",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg shadow-gray-500">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify your Account
          </h1>
          <p className="mb-4">
            Enter your verification code sent to your email
          </p>
          <p className="text-sm text-gray-500">
            Verifying account for: {username}
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={!username}>
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default VerifyAccount;
