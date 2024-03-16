import { db } from "@/config/firebase";
import { Timestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "firebase/auth";

export type Member = {
  user: {
    displayName: string;
    email: string;
    uid: string;
  };
  joinedAt: Date | Timestamp;
  position: number;
  status: "waiting" | "in-progress" | "completed" | "waiting-room";
};

export type QueueData = {
  name: string;
  code: string;
  estimatedTime: number;
  members: Member[];
  waitingRoom: {
    members: Member[];
  };
  createdBy: string;
};

const getQueue = async (queueId: string) => {
  try {
    const _doc = await getDoc(doc(db, "queues", queueId));

    if (_doc.exists()) {
      return _doc.data() as QueueData;
    }
    return null;
  } catch (err) {
    console.log("Error getting queue data", err);
    throw err;
  }
};

const joinQueue = async (queueId: string, user: User) => {
  try {
    const queue = await getQueue(queueId);
    if (!queue) {
      throw new Error("Queue not found");
    }

    if (
      queue.members.find((member) => member.user.uid === user.uid) ||
      queue.createdBy === user.uid
    ) {
      return queue;
    }

    const members = queue.members;

    members.push({
      user: {
        displayName: user.displayName!,
        email: user.email!,
        uid: user.uid,
      },
      joinedAt: new Date(),
      position: members.length + 1,
      status: "in-progress",
    });

    await setDoc(doc(db, "queues", queueId), {
      ...queue,
      members,
    });

    return queue;
  } catch (err) {
    console.log("Error joining queue", err);
    throw err;
  }
};

const updateStatus = async (
  queueId: string,
  userId: string,
  status: Member["status"]
) => {
  try {
    const queue = await getQueue(queueId);
    if (!queue) {
      throw new Error("Queue not found");
    }

    const members = queue.members.map((member) => {
      if (member.user.uid === userId) {
        return {
          ...member,
          status,
        };
      }
      return member;
    });

    await setDoc(doc(db, "queues", queueId), {
      ...queue,
      members,
    });
  } catch (err) {
    console.log("Error updating status", err);
    throw err;
  }
};

export { getQueue, joinQueue, updateStatus };
