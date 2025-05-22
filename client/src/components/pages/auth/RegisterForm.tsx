"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CardWrapper } from "./CardWrapper";
import { useTransition, useState } from "react";
import { FormError } from "@/components/FormError";
import SuccessCard from "./SuccessCard";
import { Link } from "react-router-dom";

const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Something went wrong!");
          return;
        }

        setSuccess(data.success || "Registration successful!");
        form.reset();
        setIsSuccess(true);
      } catch (error) {
        setError("Something went wrong!");
      }
    });
  };

  if (isSuccess) {
    return <SuccessCard success={success || ""} />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen pt-6">
      <div className="max-w-md">
        <Link to="/" className="block mb-8">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-[#b593ff] to-[#d3c0fc] bg-clip-text text-transparent">
            Tenent
          </h1>
        </Link>
        <CardWrapper
          headerTitle="Register"
          backButtonLabel="Already have an account?"
          backButtonHref="/auth/login"
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              role="form"
              aria-label="Registration form"
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="firstName">First Name</FormLabel>
                      <FormControl>
                        <Input
                          id="firstName"
                          placeholder="Tyler"
                          {...field}
                          disabled={isPending}
                          type="name"
                          autoComplete="given-name"
                          aria-required="true"
                          aria-invalid={!!form.formState.errors.firstName}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="lastName">Last Name</FormLabel>
                      <FormControl>
                        <Input
                          id="lastName"
                          placeholder="Durden"
                          {...field}
                          disabled={isPending}
                          type="name"
                          autoComplete="family-name"
                          aria-required="true"
                          aria-invalid={!!form.formState.errors.lastName}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          {...field}
                          disabled={isPending}
                          placeholder="TylerDurden@gmail.com"
                          type="email"
                          autoComplete="email"
                          aria-required="true"
                          aria-invalid={!!form.formState.errors.email}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          placeholder="••••••••"
                          {...field}
                          disabled={isPending}
                          type="password"
                          autoComplete="new-password"
                          aria-required="true"
                          aria-invalid={!!form.formState.errors.password}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="confirmPassword">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="confirmPassword"
                          placeholder="••••••••"
                          {...field}
                          disabled={isPending}
                          type="password"
                          autoComplete="new-password"
                          aria-required="true"
                          aria-invalid={!!form.formState.errors.confirmPassword}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <FormError message={error} />
              <Button
                disabled={isPending}
                type="submit"
                className="p-[3px] relative font-semibold bg-[#b593ff] hover:bg-[#d3c0fc] rounded-[5px] w-full h-11"
                aria-label={
                  isPending
                    ? "Registering your account..."
                    : "Register your account"
                }
              >
                {!isPending ? "Register →" : "Registering..."}
              </Button>
            </form>
          </Form>
        </CardWrapper>
      </div>
    </div>
  );
};

export default RegisterForm;
