import { Button } from "@/components/ui/button";
import Image404 from "@/public/404-image.png";
import Image from "next/image";
import Link from "next/link";

export default function () {
	return (
		<div className="w-full max-xl:max-w-[1000px] max-w-[1200px] mx-auto flex flex-col items-center justify-center grow max-sm:p-4 md:p-6">
			<Image
				src={Image404}
				alt="404 image"
				className="max-md:mb-6 md:mb-8 max-md:size-32 md:size-40"
			/>

			<h2 className="text-primary max-md:text-5xl md:text-6xl font-bold  max-md:mb-8 md:mb-10 text-center">
				Page not found
			</h2>
			<p className="max-md:text-md md:text-lg max-md:mb-6 md:mb-8 text-gray-600 text-center">
				The page you are looking for may have been moved or deleted
			</p>
			<Link href="/">
				<Button className="font-semibold rounded-full">Back to home</Button>
			</Link>
		</div>
	);
}
