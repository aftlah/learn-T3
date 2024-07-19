import { number, z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.post.create({
        data: {
          name: input.name,
          updatedAt: new Date(),
        },
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany({
      take: 5,
    });
  }),

  delete: publicProcedure
    .input(z.object({ id: number() }))
    .mutation(async ({ ctx, input }) => (
      await ctx.db.post.delete({
        where: {
          id: input.id
        }
      })
    )),

  update: publicProcedure
    .input(z.object({ id: number(), name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.post.update({
        where: {
          id: input.id
        },
        data: {
          name: input.name
        }
      })
    })

});
