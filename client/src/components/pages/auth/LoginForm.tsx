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
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CardWrapper } from "./CardWrapper";
import { useTransition, useState } from "react";

import { FormError } from "@/components/FormError";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");

    startTransition(async () => {
      try {
        const response = await fetch("http://localhost:3000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Something went wrong!");
          return;
        }

        // Store the token in localStorage
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } catch (error) {
        setError("Something went wrong!");
      }
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen pt-6">
      <CardWrapper
        headerTitle="Welcome Back"
        backButtonLabel="Don't have an account?"
        backButtonHref="/auth/register"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
            role="form"
            aria-label="Login form"
          >
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email" className="text-sm font-medium">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        {...field}
                        disabled={isPending}
                        placeholder="TylerDurden@gmail.com"
                        type="email"
                        autoComplete="email"
                        className="border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20 h-11"
                        aria-required="true"
                        aria-invalid={!!form.formState.errors.email}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="password"
                      className="text-sm font-medium"
                    >
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        placeholder="••••••••"
                        {...field}
                        disabled={isPending}
                        type="password"
                        autoComplete="current-password"
                        className="border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20 h-11"
                        aria-required="true"
                        aria-invalid={!!form.formState.errors.password}
                      />
                    </FormControl>
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="link"
                        className="px-0 text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                        type="button"
                        aria-label="Reset your password"
                      >
                        <Link to="/auth/reset">Forgot Password?</Link>
                      </Button>
                    </div>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormError message={error} />

            <Button
              disabled={isPending}
              type="submit"
              className="p-[3px] relative font-semibold bg-[#b593ff] hover:bg-[#d3c0fc] rounded-[5px] w-full h-11"
              aria-label={isPending ? "Logging in..." : "Login to your account"}
            >
              {!isPending ? (
                <>
                  Login
                  <svg
                    className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </>
              ) : (
                "Logging in..."
              )}
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
};

export default LoginForm;
