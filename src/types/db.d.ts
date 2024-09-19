import { Post, Subreddit, User, Vote, Comment } from "@prisma/client";

export type ExtendedPost = Post & {
  subreddit: Subreddit;
  votes: Votes[];
  author: User;
  comments: Comment[];
};
