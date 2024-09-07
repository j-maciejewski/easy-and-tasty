import bbq from "@/public/mock/meals/bbq.jpg";
import { api } from "@/trpc/server";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "../_components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function () {
	const cuisines = await api.public.cuisine.getCuisines();

	return (
		<div className="pt-6 max-xl:px-[3vw] w-full">
			<Breadcrumbs paths={[{ label: "Cuisines", active: true }]} />

			<div className="gap-4 grid grid-cols-[repeat(auto-fill,_minmax(225px,_1fr))]">
				{cuisines.map((cuisine) => (
					<Card
						key={cuisine.id}
						className="max-xl:min-w-[200px] max-w-[500px] w-full flex flex-col h-full shadow"
					>
						<CardContent className="p-0 rounded-t-lg hover:bg-accent transition ease-in-out">
							<Link href={`/cuisines/${cuisine.name.toLowerCase()}`}>
								<Image
									src={bbq}
									className="aspect-square rounded-t-lg min-h-[225px] max-h-[225px] object-cover w-full transition ease-in-out hover:-translate-x-1 hover:-translate-y-1"
									alt="cuisine"
								/>
							</Link>
						</CardContent>
						<CardHeader className="p-2 grow justify-center">
							<CardTitle className="text-md text-center">
								<Link
									href={`/cou/${cuisine.slug}`}
									className="hover:text-gray-600"
								>
									{cuisine.name}
								</Link>
							</CardTitle>
						</CardHeader>
					</Card>
				))}
			</div>
		</div>
	);
}
