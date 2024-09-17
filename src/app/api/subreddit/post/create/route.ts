import { PostValidator } from "@/lib/validators/post";
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

    const { subredditId, title, content } = PostValidator.parse(body);

    const subscriptionExists = await db.subcription.findFirst({
      where: {
        subredditId,
        userId: userId?.id,
      },
    });

    if (!subscriptionExists) {
      return new Response("you are not subscribed", { status: 400 });
    }
    if (!userId) {
      return new Response("unauthorized", { status: 401 });
    }

    await db.post.create({
      data: {
        title,
        content,
        authorId: userId.id,
        subredditId,
      },
    });

    return new Response(subredditId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }
    return new Response("Could not Post to subreddit", { status: 500 });
  }
}
