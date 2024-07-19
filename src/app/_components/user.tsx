"use client";
import React, { useState } from "react";
import Link from "next/link";

import { api } from "@/trpc/react";

type User = {
    id: number | string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
};

function ListMahasiswa() {
    const datas = api.user.getListMhs.useQuery();
    const data = datas.data as User[];

    const [namaMhs, setNamaMhs] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [id, setId] = useState<number | string>("");
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

    useState(() => {
        console.log(data);
    });

    const utils = api.useUtils();
    // console.log(utils.user);

    const createMhs = api.user.createMhs.useMutation({
        onSuccess: async () => {
            await utils.user.invalidate();
            setNamaMhs("");
            setEmail("");
        },
    });

    const deleteMhs = api.user.deleteMhs.useMutation({
        onSuccess: async () => {
            await utils.user.invalidate();
        },
    });

    const updateMhs = api.user.updateMhs.useMutation({
        onSuccess: async () => {
            await utils.user.invalidate();
            setNamaMhs("");
            setEmail("");
        },
    });

    const handleUpdate = (user: User) => {
        setIsUpdating(true);
        setId(user.id);
        setNamaMhs(user.name);
        setEmail(user.email);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isUpdating) {
            updateMhs.mutate({ id: Number(id), name: namaMhs, email: email });
            setIsUpdating(false);
            setId("");
        } else {
            createMhs.mutate({ name: namaMhs, email: email });
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            <div className="mt-5 flex gap-10">
                <div>
                    <Link href={"/"} className="h-auto rounded-xl bg-red-600 p-2">
                        Back
                    </Link>
                </div>
                <div className="flex flex-col items-center">
                    <div className="mt-5">ListMahasiswa</div>
                    <div className="container flex flex-col items-center gap-2 px-4 py-10">
                        {data ? (
                            data.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex w-[30rem] justify-between rounded-lg bg-white/10 p-4 text-center"
                                >
                                    <div className="text-left">
                                        <p className="text-white">{user.name}</p>
                                        <p className="text-white">{user.email}</p>
                                    </div>
                                    <div className="flex flex-row gap-x-2">
                                        <button onClick={() => handleUpdate(user)}>Edit</button>
                                        <button
                                            onClick={() => {
                                                deleteMhs.mutate({ id: Number(user.id) });
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>

                    {/* Buat Inputan Untuk tambah user */}
                    <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2">
                        <input
                            type="text"
                            placeholder="namaMhs Mahasiswa"
                            value={namaMhs}
                            onChange={(e) => setNamaMhs(e.target.value)}
                            className="w-full rounded-full px-4 py-2 text-black"
                        />
                        <input
                            type="text"
                            placeholder="Email Mahasiswa"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-3 w-full rounded-full px-4 py-2 text-black"
                        />

                        <button
                            type="submit"
                            className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
                            disabled={createMhs.isPending}
                        >
                            {createMhs.isPending ? "Submitting..." : "Submit"}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default ListMahasiswa;
