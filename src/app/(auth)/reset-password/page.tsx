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
import { Separator } from "@/components/ui/separator";
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
				<CardTitle className="text-xl">Reset password</CardTitle>
				<CardDescription>Enter the email of your account</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<AuthInput
							name="email"
							type="email"
							placeholder="max@example.com"
							required
						/>
					</div>
					<Button
						type="submit"
						className="w-full bg-green-500 hover:bg-green-600 text-white"
					>
						Reset password
					</Button>
				</div>
				<div className="mt-4 text-center text-sm flex space-x-4 items-center">
					<div className="grow">
						<Link href="/login" className="underline">
							Sign in
						</Link>
					</div>
					<Separator orientation="vertical" className="h-4" />
					<div className="grow">
						<Link href="/sign-up" className="underline">
							Sign up
						</Link>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
