"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const { user, login, logout, register } = useAuth();

  const router = useRouter();

  const [data, setData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await register(data.name, data.email, data.password);
      router.push("/");
    } catch (e) {
      console.log(e);
    }

    setIsLoading(false);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="email">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Sainath Poojary"
                type="text"
                autoCapitalize="none"
                autoComplete="name"
                autoCorrect="off"
                onChange={(e) => {
                  setData({ ...data, name: e.target.value });
                }}
                value={data.name}
                disabled={isLoading}
                className="focus:ring-0"
              />
            </div>
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="email"></Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                onChange={(e) => {
                  setData({ ...data, email: e.target.value });
                }}
                value={data.email}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="email"></Label>
              <Input
                id="password"
                placeholder="Password"
                type="password"
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect="off"
                onChange={(e) => {
                  setData({ ...data, password: e.target.value });
                }}
                value={data.password}
                disabled={isLoading}
              />
            </div>
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create account
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading}>
        <Icons.google className="mr-2 h-4 w-4" /> Google
      </Button>
    </div>
  );
}
