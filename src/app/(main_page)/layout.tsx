import { Facebook, Instagram } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import logo from "@/public/logo.png";
import { CircleUserRound, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ({ children }: React.PropsWithChildren) {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-background">
			<header className="w-full bg-white">
				<div className="mx-auto px-4 py-3 max-xl:max-w-[1000px] max-w-[1200px] flex justify-between items-center h-[80px]">
					<div>
						<Link href="/">
							<Image src={logo} alt="logo" height={40} priority />
						</Link>
					</div>
					<div className="relative max-sm:w-full mr-4">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search recipes..."
							className="w-full rounded-lg bg-background pl-8 md:w-[300px] lg:w-[360px] h-fit"
						/>
					</div>

					<div className="flex gap-4 items-center">
						<Facebook className="size-5" />
						<Instagram className="size-5" />
						<Link href="/login">
							<Button className="text-black" variant="link">
								<CircleUserRound className="size-5 mr-2" />
								Sign in
							</Button>
						</Link>
						<Separator orientation="vertical" />
					</div>
				</div>
			</header>
			<div className="bg-white w-full shadow-lg max-lg:hidden">
				<div className="mx-auto px-4 pb-4 pt-2 max-xl:max-w-[1000px] max-w-[1200px] flex justify-between items-center text-black">
					<ul className="flex gap-8 uppercase tracking-wide font-bold h-fit text-sm w-full">
						<li>
							<Link href="/recipes/snacks">Snacks</Link>
						</li>
						<li>
							<Link href="/recipes/soups">Soups</Link>
						</li>
						<li>
							<Link href="/recipes/salads">Salads</Link>
						</li>
						<li>
							<Link href="/recipes/lunch">Lunch</Link>
						</li>
						<li>
							<Link href="/recipes/drinks">Drinks</Link>
						</li>
						<li>
							<Link href="/recipes/desserts">Desserts</Link>
						</li>
						<li>
							<Link href="/blog">Blog</Link>
						</li>
						<li>
							<Link href="/about">About us</Link>
						</li>
						<li>
							<Link href="/recipes">All Recipes</Link>
						</li>
					</ul>
				</div>
			</div>
			<main className="grow w-full max-md:py-4 max-lg:py-6 lg:py-8 flex flex-col">
				<div className="w-full max-xl:max-w-[1000px] max-w-[1200px] mx-auto flex flex-col xl:flex-row grow">
					{children}
				</div>
			</main>
			<footer className="bg-gray-700 px-4 py-2 w-full text-center text-gray-300 text-xs">
				easy and tasty | Copyright © 2024 - All Rigths reserved
			</footer>
		</div>
	);
}
