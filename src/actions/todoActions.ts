"use server";

import { authOptions } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { log } from '@logtail/next';

export const addTodo = async (formData: FormData) => {
    log.info("addTodo being handled");
    const session = await getServerSession(authOptions);

    try {
        const todoText = formData.get("todotext") as string;

        log.info("Adding new TODO.", { session, todoText, formData });

        if (!todoText) {
            throw new Error("Todo text is required");
        }

        const todo = await prisma.todo.create({
            data: {
                text: todoText,
                user: {
                    connect: {
                        id: session?.user.id,
                    },
                },
            },
        });

        revalidatePath("/todos");
    } catch (error) {
        log.error("Error during adding TODO.", { error });
        console.log(error);
    }

    await log.flush();
};

export const checkTodo = async (id: string, completed: boolean) => {
    log.info("checkTodo being handled");
    const session = await getServerSession(authOptions);

    try {
        log.info("Checking TODO.", { session, id, completed });

        await prisma.todo.update({
            select: {
                completed: true,
            },
            where: {
                id: id,
                userId: session?.user.id,
            },
            data: {
                completed: completed,
            },
        });

        revalidatePath("/todos");
    } catch (error) {
        log.error("Error during deleting TODO.", { error });
    }

    await log.flush();
};

export const deleteTodo = async (id: string) => {
    log.info("deleteTodo being handled");
    const session = await getServerSession(authOptions);

    try {
        log.info("Deleting TODO.", { session, id });

        await prisma.todo.delete({
            where: {
                id: id,
                userId: session?.user.id,
            },
        });
    } catch (error) {
        log.error("Error during deleting TODO.", { error });
    }

    revalidatePath("/todos");
    await log.flush();
};
