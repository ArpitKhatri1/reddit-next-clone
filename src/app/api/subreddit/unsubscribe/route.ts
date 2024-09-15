import { SubredditSubscsriptionValidator } from "@/lib/validators/subreddit";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { getUserId } from "@/lib/getUserId";
import { Prisma } from "@prisma/client";
import { z } from "zod";
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    const userId = await getUserId();
    const body = await req.json();

    const { subredditId } = SubredditSubscsriptionValidator.parse(body);

    const subscriptionExists = await db.subcription.findFirst({
      where: {
        subredditId,
        userId: userId?.id,
      },
    });
    if (!subscriptionExists) {
      return new Response("you are not already subscribed", { status: 400 });
    }
    if (!userId) {
      return new Response("unauthorized", { status: 401 });
    }

    await db.subcription.delete({
      where: {
        userId_subredditId: {
          subredditId,
          userId: userId.id,
        },
      },
    });
    return new Response(subredditId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }
    return new Response("Could not subscribe", { status: 500 });
  }
}
