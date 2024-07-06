import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import logo from "@/public/logo.png";
import Image from "next/image";
import { AuthInput } from "../_components/AuthInput";

export default function () {
	return (
		<Card className="mx-auto max-w-sm min-w-[350px]">
			<CardHeader>
				<Link href="/">
					<Image src={logo} alt="logo" className="mx-auto mb-2" height={40} />
				</Link>
				<CardTitle className="text-xl">Sign Up</CardTitle>
				<CardDescription>
					Enter your information to create an account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="grid gap-2">
							<Label htmlFor="first-name">First name</Label>
							<AuthInput name="firstName" placeholder="Max" required />
						</div>
						<div className="grid gap-2">
							<Label htmlFor="last-name">Last name</Label>
							<AuthInput name="lastName" placeholder="Robinson" required />
						</div>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<AuthInput
							name="email"
							type="email"
							placeholder="max@example.com"
							required
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password">Password</Label>
						<AuthInput name="password" type="password" />
					</div>
					<Button type="submit" className="w-full">
						Create an account
					</Button>
				</div>
				<div className="mt-4 text-center text-sm">
					Already have an account?{" "}
					<Link href="/login" className="underline">
						Sign in
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
