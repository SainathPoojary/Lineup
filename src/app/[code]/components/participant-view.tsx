"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/config/firebase";
import { useAuth } from "@/context/AuthContext";
import { Member, QueueData } from "@/lib/api";
import { User } from "firebase/auth";
import { Timestamp, doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ParticipantViewProps = {
  code: string;
};

export default function ParticipantView({ code }: ParticipantViewProps) {
  const [memberData, setMemberData] = useState<{
    estimatedTime: number;
    position: number;
    memberBefore: number;
    joinedAt: string;
  } | null>();

  const { user } = useAuth();
  const [queueData, setQueueData] = useState<QueueData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "queues", code), (doc) => {
      if (doc.exists()) {
        setQueueData(doc.data() as QueueData);
        const member = getCurrentMemberData(doc.data() as QueueData, user!);
        setMemberData(member);
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

  return (
    <div className="flex-1  flex-col space-y-5 flex items-center justify-center">
      <h2 className="font-bold text-3xl text-center">Hackoverflow 2.0</h2>
      <div className="border-8 border-primary  p-5 w-[20rem] h-[20rem] md:w-[22rem] md:h-[22rem] rounded-full flex justify-center items-center">
        <div className="flex flex-col items-center justify-center space-y-2">
          <h3 className="font-bold text-4xl text-center">
            Your Ticket number is #{memberData?.position}
          </h3>
          <p className="text-center text-xl text-gray-500 font-medium">
            {memberData?.memberBefore == 0 ? (
              <span>It&apos;s your turn. </span>
            ) : (
              <span>
                There are{" "}
                <span className="text-black">
                  {" "}
                  {memberData?.memberBefore} customers{" "}
                </span>{" "}
                before you.
              </span>
            )}
            {memberData?.memberBefore != 0 && (
              <span>
                You estimated waiting time is{" "}
                {/* <span className="text-black"> {queueData?.estimatedTime}</span>. */}
                <span className="text-black"> 10 mins</span>.
              </span>
            )}
          </p>
        </div>
      </div>
      <p className="text-xl font-semibold text-gray-600">
        Joined at {memberData?.joinedAt.toString()}
      </p>
      <Button size={"lg"}>Cancel Queue</Button>
    </div>
  );
}

function getCurrentMemberData(queueData: QueueData, user: User) {
  const member = queueData.members.find(
    (member) => member.user.uid === user.uid
  );

  if (!member) {
    return null;
  }

  const estimatedTime = queueData.estimatedTime;
  const position = member?.position;
  const memberBefore = queueData.members.filter(
    (member) =>
      member.position < position &&
      (member.status === "in-progress" || member.status === "waiting")
  );

  console.log(memberBefore);

  return {
    estimatedTime,
    position,
    memberBefore: memberBefore.length,
    joinedAt: new Date(
      (member.joinedAt as Timestamp).toDate()
    ).toLocaleString(),
  };
}
