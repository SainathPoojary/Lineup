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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";

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

  const handleComplete = async (userId: string) => {
    try {
      await updateStatus(queueData!.code, userId, "completed");
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
          {queueData?.members
            .filter((member) => member.status === "waiting")
            .map((member: Member) => (
              <Card
                handleComplete={handleComplete}
                key={member.user.uid}
                member={member}
              />
            ))}
        </div>

        {/* Past Participants */}
        <PastParticipantsSection queueData={queueData} />
      </TabsContent>
      <TabsContent value="password">
        <div className="flex flex-col space-y-5 my-5"></div>
      </TabsContent>

      {/* TODO: Add a section for Processed queue, Past people in queue */}
    </Tabs>
  );
}

function Card({
  member,
  handleComplete,
  completeButton = true,
}: {
  member: Member;
  handleComplete: (userId: string) => void;
  completeButton?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-2 py-2 bg-white border-[1px] rounded-lg hover:bg-primary/5">
      <div className="flex space-x-4 items-center justify-between">
        <div className="bg-primary rounded-full p-2">
          <User size={20} color="white" />
        </div>

        <h3>{member.user.displayName}</h3>
      </div>

      <div className="flex justify-center items-center space-x-2">
        {completeButton && (
          <div
            onClick={() => handleComplete(member.user.uid)}
            className="border-[1px] hover:bg-primary/10 rounded-full p-2"
          >
            <Check size={16} />
          </div>
        )}
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

const PastParticipantsSection = ({
  queueData,
}: {
  queueData: QueueData | null;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (
    queueData?.members.filter((member) => member.status === "completed")
      .length == 0
  ) {
    return null;
  }

  return (
    <div>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full space-y-2"
      >
        <div className="flex items-center  space-x-4 px-4">
          <h4 className="text-sm font-semibold">Past Participants ({10})</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <CaretSortIcon className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="space-y-2">
          {queueData?.members
            .filter((member) => member.status === "completed")
            .map((member) => (
              <Card
                key={member.user.uid}
                member={member}
                handleComplete={() => {}}
                completeButton={false}
              />
            ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
