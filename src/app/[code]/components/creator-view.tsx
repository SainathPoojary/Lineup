"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/config/firebase";
import { useAuth } from "@/context/AuthContext";
import { Member, QueueData, updateStatus } from "@/lib/api";
import { doc, onSnapshot } from "firebase/firestore";
import { Check, LogOut, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type CreatorViewProps = {
  code: string;
};

export default function CreatorView({ code }: CreatorViewProps) {
  const [queueData, setQueueData] = useState<QueueData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

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

  const handleComplete = async () => {
    try {
      await updateStatus(queueData!.code, user?.uid!, "completed");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Tabs defaultValue="account" className="w-full ">
      <TabsList className="w-full flex justify-start ">
        <TabsTrigger value="account">Main Room</TabsTrigger>
        <TabsTrigger value="password">Waiting Room</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <div className="flex flex-col space-y-5 my-5">
          {queueData?.members.map((member: Member) => (
            <Card key={member.user.uid} member={member} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="password">
        <div className="flex flex-col space-y-5 my-5"></div>
      </TabsContent>

      {/* TODO: Add a section for Processed queue, Past people in queue */}
    </Tabs>
  );
}

function Card({ member }: { member: Member }) {
  return (
    <div className="flex items-center justify-between px-2 py-2 bg-white border-[1px] rounded-lg hover:bg-primary/5">
      <div className="flex space-x-4 items-center justify-between">
        <div className="bg-primary rounded-full p-2">
          <User size={20} color="white" />
        </div>

        <h3>{member.user.displayName}</h3>
      </div>

      <div className="flex justify-center items-center space-x-2">
        <div className="border-[1px] hover:bg-primary/10 rounded-full p-2">
          <Check size={16} />
        </div>
        {/* <div className="border-[1px] hover:bg-primary/10 rounded-full p-2">
          <X size={16} />
        </div> */}
        <div className="border-[1px] hover:bg-primary/10 rounded-full p-2">
          <LogOut size={16} />
        </div>
      </div>
    </div>
  );
}
