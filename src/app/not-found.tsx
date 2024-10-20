import { Button } from "@/components/ui/button";
import Image404 from "@/public/404-image.png";
import Image from "next/image";
import Link from "next/link";

export default function () {
	return (
		<div className="mx-auto flex min-h-screen w-full max-w-[1200px] grow flex-col items-center justify-center max-sm:p-4 max-xl:max-w-[1000px] md:p-6">
			<Image
				src={Image404}
				alt="404 image"
				className="max-md:mb-6 max-md:size-32 md:mb-8 md:size-40"
			/>

			<h2 className="text-center font-bold text-accent max-md:mb-8 max-md:text-5xl md:mb-10 md:text-6xl">
				Page not found
			</h2>
			<p className="text-center text-gray-600 max-md:mb-6 max-md:text-md md:mb-8 md:text-lg">
				The page you are looking for may have been moved or deleted
			</p>
			<Link href="/">
				<Button variant="secondary" className="rounded-full font-semibold">
					Back to home
				</Button>
			</Link>
		</div>
	);
}
