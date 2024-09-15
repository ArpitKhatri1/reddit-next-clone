import { db } from "./db";
import { getServerSession } from "next-auth";

export const InitialProfile = async () => {
  const session = await getServerSession();
  if (!session) {
    return;
  }

  const presentUser = await db.user.findFirst({
    where: {
      email: session.user?.email,
    },
  });

  if (presentUser) {
    return presentUser;
  } else {
    const data = await db.user.create({
      data: {
        name: session.user?.name,
        email: session.user?.email,
        image: session.user?.image,
      },
    });

    return data;
  }
};
