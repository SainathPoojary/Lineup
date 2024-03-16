"use client";
import { Header } from "@/components/header";
import { useParams, useRouter } from "next/navigation";
import CreatorView from "./components/creator-view";
import { useEffect, useState } from "react";
import { QueueData } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import ParticipantView from "./components/participant-view";
import { useAuth } from "@/context/AuthContext";
import { Icons } from "@/components/icons";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase";

export default function Dashboard() {
  const { code } = useParams<{
    code: string;
  }>();

  const router = useRouter();
  const { user } = useAuth();
  const [queueData, setQueueData] = useState<QueueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "queues", code), (doc) => {
      if (doc.exists()) {
        setQueueData(doc.data() as QueueData);
        setLoading(false);
      } else {
        toast({
          title: "Queue not found",
          description: "The queue you are looking for does not exist",
        });
        router.push("/");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Icons.spinner className="animate-spin duration-200 h-10 w-10 stroke-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header code={code} />
      <main className="px-5 h-full flex-1 flex flex-col">
        {user?.uid === queueData?.createdBy ? (
          <CreatorView code={code} />
        ) : (
          <ParticipantView code={code} />
        )}
      </main>
    </div>
  );
}
