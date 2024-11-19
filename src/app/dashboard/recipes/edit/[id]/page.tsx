"use client";

import { EditRecipeForm } from "@/app/dashboard/_components/EditRecipeForm";

export default function ({ params }: { params: { id: string } }) {
	return (
		<main className="flex-1 overflow-y-auto overflow-x-hidden">
			<div className="container mx-auto px-6 py-8">
				<EditRecipeForm recipeId={Number(params.id)} />
			</div>
		</main>
	);
}
