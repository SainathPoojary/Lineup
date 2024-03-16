"use client";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Icons } from "@/components/icons";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { toast } from "@/components/ui/use-toast";
import ShortUniqueId from "short-unique-id";
import { joinQueue } from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const uuid = new ShortUniqueId({ length: 4 });

  uuid.setDictionary("alpha_lower");

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  const createQueue = async () => {
    try {
      setIsLoading(true);
      if (!user) {
        toast({
          title: "Please login to create a queue",
          description: "You need to login to create a queue",
        });
        return;
      }

      const code = `${uuid.rnd()}-${uuid.rnd()}-${uuid.rnd()}`;

      await setDoc(doc(db, "queues", code), {
        name: "Sainath",
        code,
        estimatedTime: 0,
        members: [],
        waitingRoom: [],
        createdBy: user.uid,
        createdAt: new Date(),
      });
      setIsLoading(false);
      router.push(`/${code}`);
    } catch (e) {
      console.log(e);
    }
  };

  const _joinQueue = async () => {
    try {
      if (code.length === 0 || user === null) {
        toast({
          title: "Please enter a code",
          description: "You need to enter a code to join a queue",
        });
        return;
      }
      const queue = await joinQueue(code, user);

      if (!queue) {
        toast({
          title: "Queue not found",
          description: "Invalid queue code",
        });
        return;
      }

      router.push(`/${code}`);
    } catch (e) {
      console.log(e);
      toast({
        title: "Error joining queue",
        description: "An error occurred while joining the queue",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col lg:flex-row justify-between items-center px-16">
        <div className="flex flex-col space-y-2 lg:space-y-14 py-10">
          <div className="flex flex-col space-y-5 ">
            <h1 className="text-5xl font-medium">
              Say Goodbye to Lines, Optimize with Us
            </h1>
            <p className="text-gray-500 text-lg max-w-xl">
              Experience seamless waiting with our efficient queue management
              system, ensuring a smooth and organized process for all.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5">
            <Button onClick={createQueue}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Start a queue
            </Button>
            <div className="flex">
              <Input
                className="max-w-2xl"
                placeholder="Enter a code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                }}
              />
              <Button
                onClick={() => {
                  _joinQueue();
                }}
                variant={"ghost"}
                disabled={code.length === 0}
              >
                Join
              </Button>
            </div>
          </div>
          <Separator className="my-4" />
        </div>

        <div className="flex flex-col justify-center items-center space-y-4 ">
          <Carousel className="w-full max-w-xs mx-28">
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-4xl font-semibold">
                          {index + 1}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="flex flex-col justify-center items-center">
            <h2>Your meeting is safe</h2>
            <p>
              No one can join a meeting unless invited or admitted by the host
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
