"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { UserAuthForm } from "./components/user-auth-form";
import { useRouter } from "next/navigation";

export default function Register() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  return (
    <>
      <div className="container relative  h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Login
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-8 w-8"
            >
              <path
                d="M14 8.39999C14 9.35477 13.6207 10.2704 12.9456 10.9456C12.2704 11.6207 11.3548 12 10.4 12C9.44521 12 8.52953 11.6207 7.8544 10.9456C7.17927 10.2704 6.79999 9.35477 6.79999 8.39999C6.79999 7.44521 7.17927 6.52953 7.8544 5.8544C8.52953 5.17927 9.44521 4.79999 10.4 4.79999C11.3548 4.79999 12.2704 5.17927 12.9456 5.8544C13.6207 6.52953 14 7.44521 14 8.39999ZM6.39999 12.8C5.97564 12.8 5.56868 12.9686 5.26862 13.2686C4.96856 13.5687 4.79999 13.9756 4.79999 14.4V21.6C4.79999 22.3354 4.94484 23.0636 5.22626 23.743C5.50769 24.4224 5.92018 25.0398 6.44019 25.5598C6.9602 26.0798 7.57754 26.4923 8.25696 26.7737C8.93638 27.0551 9.66459 27.2 10.4 27.2C11.1354 27.2 11.8636 27.0551 12.543 26.7737C13.2224 26.4923 13.8398 26.0798 14.3598 25.5598C14.8798 25.0398 15.2923 24.4224 15.5737 23.743C15.8551 23.0636 16 22.3354 16 21.6V14.4C16 13.9756 15.8314 13.5687 15.5314 13.2686C15.2313 12.9686 14.8243 12.8 14.4 12.8H6.39999ZM15.6 8.39999C15.6 9.43999 15.296 10.408 14.768 11.2208C15.4288 11.2976 16.0272 11.5728 16.5024 11.9888C17.0802 12.0365 17.6611 11.944 18.1955 11.7191C18.7299 11.4942 19.202 11.1435 19.5718 10.6969C19.9416 10.2503 20.198 9.72098 20.3193 9.15399C20.4406 8.587 20.4231 7.9991 20.2684 7.44032C20.1136 6.88153 19.8262 6.36838 19.4306 5.94453C19.0349 5.52068 18.5428 5.19866 17.996 5.00586C17.4491 4.81307 16.8638 4.75521 16.2898 4.8372C15.7159 4.91919 15.1702 5.13861 14.6992 5.47679C15.2672 6.30879 15.6 7.31679 15.6 8.39999ZM15.2 26.968C15.9561 26.2932 16.5608 25.466 16.9745 24.5408C17.3881 23.6157 17.6013 22.6134 17.6 21.6V14.4C17.6 13.8176 17.4432 13.2704 17.1712 12.8H20.8C21.2243 12.8 21.6313 12.9686 21.9314 13.2686C22.2314 13.5687 22.4 13.9756 22.4 14.4V21.6C22.4002 22.4723 22.1966 23.3326 21.8055 24.1123C21.4144 24.892 20.8465 25.5696 20.1472 26.091C19.4479 26.6124 18.6364 26.9632 17.7775 27.1155C16.9186 27.2677 16.0359 27.2172 15.2 26.968ZM22 8.39999C22 9.43999 21.696 10.408 21.168 11.2208C21.8288 11.2976 22.4272 11.5728 22.9024 11.9888C23.4802 12.0365 24.0611 11.944 24.5955 11.7191C25.1299 11.4942 25.602 11.1435 25.9718 10.6969C26.3416 10.2503 26.598 9.72098 26.7193 9.15399C26.8406 8.587 26.8231 7.9991 26.6684 7.44032C26.5136 6.88153 26.2262 6.36838 25.8306 5.94453C25.4349 5.52068 24.9428 5.19866 24.396 5.00586C23.8491 4.81307 23.2638 4.75521 22.6898 4.8372C22.1159 4.91919 21.5702 5.13861 21.0992 5.47679C21.6672 6.30879 22 7.31679 22 8.39999ZM21.6 26.968C22.3561 26.2932 22.9608 25.466 23.3745 24.5408C23.7881 23.6157 24.0013 22.6134 24 21.6V14.4C24 13.8176 23.8432 13.2704 23.5712 12.8H27.2C27.6243 12.8 28.0313 12.9686 28.3314 13.2686C28.6314 13.5687 28.8 13.9756 28.8 14.4V21.6C28.8002 22.4723 28.5966 23.3326 28.2055 24.1123C27.8144 24.892 27.2465 25.5696 26.5472 26.091C25.8479 26.6124 25.0364 26.9632 24.1775 27.1155C23.3186 27.2677 22.4359 27.2172 21.6 26.968Z"
                fill="#2463EB"
              />
            </svg>
            Lineup{" "}
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="">
                &ldquo;Minimize wait times and maximize customer flow to scale
                operations and rev up revenues with Wavetec’s Enterprise Queue
                Management Solutions.&rdquo;
              </p>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to create your account
              </p>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
