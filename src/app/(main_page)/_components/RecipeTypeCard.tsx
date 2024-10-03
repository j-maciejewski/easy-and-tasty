import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import SampleImage from "@/public/mock/meals/sample-image.jpg";

namespace RecipeTypeCard {
	export interface Props {
		name: string;
		href: string;
	}
}

export const RecipeTypeCard = ({ name, href }: RecipeTypeCard.Props) => {
	return (
		<div className="hover:bg-primary/75 transition ease-in-out rounded-lg shadow-sm">
			<Link href={href}>
				<Card className="max-xl:min-w-[200px] max-w-[500px] w-full flex flex-col h-full transition ease-in-out hover:-translate-x-1 hover:-translate-y-1 overflow-hidden">
					<CardContent className="p-0">
						<Image
							src={SampleImage}
							className="aspect-square rounded-t-lg min-h-[225px] max-h-[225px] object-cover w-full "
							alt="cuisine"
						/>
					</CardContent>
					<CardHeader className="p-2 grow justify-center">
						<CardTitle className="text-md text-center tracking-normal">
							{name}
						</CardTitle>
					</CardHeader>
				</Card>
			</Link>
		</div>
	);
};
