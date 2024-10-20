import { Facebook, Instagram } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import icon from "@/public/icon.png";
import logo from "@/public/logo2.png";
import { CircleUserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Searchbar } from "./_components";

export default function ({ children }: React.PropsWithChildren) {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background">
			<header className="w-full bg-white max-lg:shadow-lg">
				<div className="mx-auto flex h-[80px] max-w-[1200px] items-center justify-between px-4 py-3 max-xl:max-w-[1000px]">
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
								className="mr-2 min-w-min lg:hidden"
								height={40}
								priority
							/>
						</Link>
					</div>
					<Searchbar />
					<div className="flex items-center gap-4">
						<Facebook className="size-5" />
						<Instagram className="size-5" />
						<Button asChild variant="link">
							<Link href="/login">
								<CircleUserRound className="mr-2 size-5" />
								Sign in
							</Link>
						</Button>
						<Separator orientation="vertical" />
					</div>
				</div>
			</header>
			<div className="w-full bg-white shadow-lg max-lg:hidden">
				<div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 pt-2 pb-4 text-black max-xl:max-w-[1000px] [&_a:hover]:hover:text-primary/95">
					<ul className="flex h-fit w-full gap-8 font-bold text-sm uppercase tracking-wider">
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
			<main className="flex w-full grow flex-col max-md:py-4 max-lg:py-6 lg:py-8">
				<div className="mx-auto flex w-full max-w-[1200px] grow flex-col max-xl:max-w-[1000px] xl:flex-row">
					{children}
				</div>
			</main>
			<footer className="w-full bg-gray-200 px-4 py-2 text-center text-gray-700 text-xs">
				easy and tasty | Copyright © 2024 - All Rigths reserved
			</footer>
		</div>
	);
}
