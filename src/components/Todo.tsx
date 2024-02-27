"use client";

import { useTransition } from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
import { checkTodo, deleteTodo } from "@/actions/todoActions";

type TodoProps = Todo & {
    setOptimisticTodos: (
        action: Todo[] | ((pendingState: Todo[]) => Todo[])
    ) => void;
};

const Todo = ({ id, text, completed, setOptimisticTodos }: TodoProps) => {
    const [isPending, startTransition] = useTransition();

    return (
        <div className="bg-slate-800 px-6 py-3 rounded">
            <form className="flex gap-2 items-center">
                <Checkbox.Root
                    className={`border-2 appearance-none outline-none focus-visible:ring-2 focus-visible:ring-black border-sky-300 rounded bg-transparent w-5 h-5 ${
                        isPending ? "opacity-50" : ""
                    }`}
                    defaultChecked={completed}
                    id={`complete-todo-${id}`}
                    name="completed"
                    onClick={() => {
                        setOptimisticTodos((prev) => {
                            return prev.map((todo) => {
                                if (todo.id === id) {
                                    return {
                                        ...todo,
                                        completed: !todo.completed,
                                    };
                                }
                                return todo;
                            });
                        });

                        startTransition(() => {
                            // @ts-ignore
                            checkTodo(id, !completed);
                        });
                    }}
                    disabled={isPending}
                >
                    <Checkbox.Indicator className="w-4 h-4 rounded bg-sky-300">
                        <CheckIcon className="text-sky-300" />
                    </Checkbox.Indicator>
                </Checkbox.Root>
                <label
                    htmlFor={`complete-todo-${id}`}
                    className={`${completed ? "line-through" : ""}`}
                >
                    {text}
                </label>
                <button
                    type="submit"
                    formAction={() => {
                        setOptimisticTodos((prev) => {
                            return prev.filter((todo) => todo.id !== id);
                        });

                        // @ts-ignore
                        deleteTodo(id);
                    }}
                    className="ml-auto text-red-300"
                >
                    <Cross1Icon className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
};

export default Todo;
