import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SampleImage from "@/public/mock/meals/sample-image.jpg";
import Image from "next/image";
import Link from "next/link";

namespace RecipeTypeCard {
	export interface Props {
		name: string;
		href: string;
	}
}

export const RecipeTypeCard = ({ name, href }: RecipeTypeCard.Props) => {
	return (
		<div className="rounded-lg shadow-sm transition ease-in-out hover:bg-primary/75">
			<Link href={href}>
				<Card className="hover:-translate-x-1 hover:-translate-y-1 flex h-full w-full max-w-[500px] flex-col overflow-hidden transition ease-in-out max-xl:min-w-[200px]">
					<CardContent className="p-0">
						<Image
							src={SampleImage}
							className="aspect-square max-h-[225px] min-h-[225px] w-full rounded-t-lg object-cover "
							alt="cuisine"
						/>
					</CardContent>
					<CardHeader className="grow justify-center p-2">
						<CardTitle className="text-center text-md tracking-normal">
							{name}
						</CardTitle>
					</CardHeader>
				</Card>
			</Link>
		</div>
	);
};
