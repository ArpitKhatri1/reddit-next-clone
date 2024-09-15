import { db } from "@/lib/db";
import { SubredditValidator } from "@/lib/validators/subreddit";
import { getServerSession } from "next-auth";
import { z } from "zod";
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new Response("Unathorized", { status: 401 });
    }

    let body;
    body = await req.json();

    const { name } = SubredditValidator.parse(body);

    const subExists = await db.subreddit.findFirst({
      where: {
        name: name,
      },
    });

    if (subExists) {
      return new Response("subreddit exists", { status: 409 });
    }
    const userId = await db.user.findFirst({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    if (!userId) {
      return new Response("Unathorized", { status: 401 });
    }

    const subreddit = await db.subreddit.create({
      data: {
        name: name,
        creatorId: userId.id,
      },
    });

    await db.subcription.create({
      data: {
        userId: userId.id,
        subredditId: subreddit.id,
      },
    });

    //$$ HANDLING AS TRANSCATIONS BLOCK SO THEY OCCUR OR FAIL AT THE SAME TIME

    // const result = await db.$transaction(async (tx) => {
    //   // Step 1: Create the subreddit and retrieve its ID
    //   const subreddit = await tx.subreddit.create({
    //     data: {
    //       name: name,          // Name of the subreddit
    //       creatorId: userId.id, // ID of the user creating the subreddit
    //     },
    //   });

    //   // Step 2: Use subreddit.id to create the subscription
    //   const subscription = await tx.subscription.create({
    //     data: {
    //       userId: userId.id,       // ID of the user subscribing
    //       subredditId: subreddit.id, // ID of the subreddit just created
    //     },
    //   });

    //   // Return both subreddit and subscription for further use if needed
    //   return { subreddit, subscription };
    // });

    // // Destructure the result if needed
    // const { subreddit, subscription } = result;

    return new Response(subreddit.name);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new Response(`could not create new subreddit ${error}`, {
      status: 500,
    });
  }
}
