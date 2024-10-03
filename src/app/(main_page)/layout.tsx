import { Facebook, Instagram } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import logo from "@/public/logo2.png";
import icon from "@/public/icon.png";
import { CircleUserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Searchbar } from "./_components";

export default function ({ children }: React.PropsWithChildren) {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-background">
			<header className="w-full bg-white max-lg:shadow-lg">
				<div className="mx-auto px-4 py-3 max-xl:max-w-[1000px] max-w-[1200px] flex justify-between items-center h-[80px]">
					<div>
						<Link href="/">
							<Image
								src={logo}
								alt="logo"
								className="max-lg:hidden"
								height={40}
								priority
							/>
							<Image
								src={icon}
								alt="icon"
								className="lg:hidden min-w-min mr-2"
								height={40}
								priority
							/>
						</Link>
					</div>
					<Searchbar />
					<div className="flex gap-4 items-center">
						<Facebook className="size-5" />
						<Instagram className="size-5" />
						<Button asChild variant="link">
							<Link href="/login">
								<CircleUserRound className="size-5 mr-2" />
								Sign in
							</Link>
						</Button>
						<Separator orientation="vertical" />
					</div>
				</div>
			</header>
			<div className="bg-white w-full shadow-lg max-lg:hidden">
				<div className="mx-auto px-4 pb-4 pt-2 max-xl:max-w-[1000px] max-w-[1200px] flex justify-between items-center text-black [&_a:hover]:hover:text-primary/95">
					<ul className="flex gap-8 uppercase tracking-wider font-bold h-fit text-sm w-full">
						<li>
							<Link href="/categories/snacks">Snacks</Link>
						</li>
						<li>
							<Link href="/categories/soups">Soups</Link>
						</li>
						<li>
							<Link href="/categories/salads">Salads</Link>
						</li>
						<li>
							<Link href="/categories/lunch">Lunch</Link>
						</li>
						<li>
							<Link href="/categories/desserts">Desserts</Link>
						</li>
						<li>
							<Link href="/blog">Blog</Link>
						</li>
						<li>
							<Link href="/about">About us</Link>
						</li>
						<li>
							<Link href="/categories">Categories</Link>
						</li>
						<li>
							<Link href="/cuisines">Cuisines</Link>
						</li>
					</ul>
				</div>
			</div>
			<main className="grow w-full max-md:py-4 max-lg:py-6 lg:py-8 flex flex-col">
				<div className="w-full max-xl:max-w-[1000px] max-w-[1200px] mx-auto flex flex-col xl:flex-row grow">
					{children}
				</div>
			</main>
			<footer className="bg-gray-200 px-4 py-2 w-full text-center text-gray-700 text-xs">
				easy and tasty | Copyright © 2024 - All Rigths reserved
			</footer>
		</div>
	);
}
