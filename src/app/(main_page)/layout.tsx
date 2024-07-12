import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import logo from "@/public/logo.png";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ({ children }: React.PropsWithChildren) {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-secondary">
			<header className="w-full bg-white">
				<div className="mx-auto px-4 py-3 max-w-[1000px] flex justify-between items-center h-[80px]">
					<div>
						<Image src={logo} alt="logo" height={40} />
					</div>
					<ul className="flex gap-5 uppercase tracking-wide font-semibold h-fit">
						<li>
							<Link href="/">Home</Link>
						</li>
						<li>
							<Link href="/recipes">Recipes</Link>
						</li>
						<li>
							<Link href="/about">About</Link>
						</li>
					</ul>
					<div className="flex gap-4">
						<Link href="/login">
							<Button className="text-muted-foreground" variant="link">
								Sign in
							</Button>
						</Link>
						<Separator orientation="vertical" />
					</div>
				</div>
			</header>
			<div className="bg-primary w-full">
				<div className="mx-auto px-4 py-3 max-w-[1000px] flex justify-between items-center text-white h-[60px]">
					<div className="text-lg font-bold">Find your new favorite recipe</div>
					<div className="relative ml-auto flex-1 md:grow-0">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search recipes..."
							className="w-full rounded-lg bg-background pl-8 md:w-[260px] lg:w-[320px] h-fit"
						/>
					</div>
				</div>
			</div>
			<main className="grow w-full">{children}</main>
			<footer className="bg-slate-900 px-4 py-2 w-full text-center text-gray-300 text-xs">
				easy and tasty | Copyright © 2024 - All Rigths reserved
			</footer>
		</div>
	);
}
