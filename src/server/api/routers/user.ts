/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'


export const userRouter = createTRPCRouter({
    getListMhs: publicProcedure.query(async ({ ctx }) => {
        try {
            const users = await ctx.db.user.findMany();
            return users;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw new Error('An error occurred while fetching users');
        }
    }),

    createMhs: publicProcedure
        .input(z.object({
            name: z.string().min(1),
            email: z.string().email()
        }))
        .mutation(async ({ ctx, input }) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            return ctx.db.user.create({
                data: {
                    name: input.name,
                    email: input.email,
                    updatedAt: new Date()
                }
            })
        }),

    deleteMhs: publicProcedure
        .input(z.object({
            id: z.number()
        }))
        .mutation(async ({ ctx, input }) => (
            await ctx.db.user.delete({
                where: {
                    id: input.id
                }
            })
        )),

    updateMhs: publicProcedure
        .input(z.object({
            id: z.number(),
            name: z.string().min(1),
            email: z.string().email()
        }))
        .mutation(async ({ ctx, input }) => (
            await ctx.db.user.update({
                where: {
                    id: input.id
                },
                data: {
                    name: input.name,
                    email: input.email
                }
            })
        ))
});
