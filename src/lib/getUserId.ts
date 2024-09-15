import { db } from "./db";
import { getServerSession } from "next-auth";

export const getUserId = async () => {
  const session = await getServerSession();
  if (!session?.user) {
    return null;
  }
  const userId = await db.user.findFirst({
    where: {
      email: session.user.email,
    },
  });

  return userId;
};
