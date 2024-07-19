"use client";

import { useState } from "react";

import { api } from "@/trpc/react";

type Post = {
	id: number;
	name: string;
};

export function LatestPost() {
	const [latestPost] = api.post.getLatest.useSuspenseQuery();
	const [isUpdating, setIsUpdating] = useState<boolean>(false);
	const [postId, setPostId] = useState<number>();


	useState(() => {
		// console.log(latestPost);
	});


	const utils = api.useUtils();
	// console.log(utils);

	const [name, setName] = useState("");

	// untuk membuat data
	const createPost = api.post.create.useMutation({
		onSuccess: async () => {
			await utils.post.invalidate();
			setName("");
		},
	});

	// untuk menghapus data
	const deletePost = api.post.delete.useMutation({
		onSuccess: async () => {
			await utils.post.invalidate();
			setName("");
		},
	})

	const updatePost = api.post.update.useMutation({
		onSuccess: async () => {
			await utils.post.invalidate();
			setName("");
		},
	})

	const handleUpdate = (post: Post) => {
		// console.log(post);

		setIsUpdating(true);
		setPostId(post.id);
		setName(post.name);
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (isUpdating) {
			updatePost.mutate({ id: Number(postId), name });
			setIsUpdating(false);
			setPostId(undefined);
		} else {
			createPost.mutate({ name });
		}
	};

	return (
		<div className="w-full max-w-xs">
			{latestPost ? (
				latestPost.map((post) => (
					<div key={post.id} className="bg-white/10 p-4 rounded-lg mt-3 ">
						<div className="text-white flex justify-between">
							<span>{post.id} {post.name}</span>
							<button
								onClick={() => {
									deletePost.mutate({ id: post.id });
								}}>
								Delete
							</button>
							<button
								onClick={() => handleUpdate(post)}>
								Edit
							</button>
						</div>
					</div>
				))
			) : (
				<p>You have no posts yet.</p>
			)}
			<form
				onSubmit={handleSubmit}
				className="flex flex-col gap-2 mt-5"
			>
				<input
					type="text"
					placeholder="Title"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="w-full rounded-full px-4 py-2 text-black"
				/>
				<button
					type="submit"
					className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
					disabled={createPost.isPending}
				>
					{createPost.isPending ? "Submitting..." : "Submit"}
				</button>
			</form>
		</div>
	);
}
