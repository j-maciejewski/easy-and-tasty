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
		<Card className="mx-auto min-w-[350px] max-w-sm">
			<CardHeader>
				<Link href="/">
					<Image src={logo} alt="logo" className="mx-auto mb-2" height={40} />
				</Link>
				<CardTitle className="text-2xl">Login</CardTitle>
				<CardDescription>
					Enter your email below to login to your account
				</CardDescription>
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
					<div className="grid gap-2">
						<div className="flex items-center">
							<Label htmlFor="password">Password</Label>
							<Link
								href="/reset-password"
								className="ml-auto inline-block text-sm underline"
							>
								Forgot your password?
							</Link>
						</div>
						<AuthInput name="password" type="password" required />
					</div>
					<Button
						type="submit"
						variant="secondary"
						className="w-full font-semibold"
					>
						Login
					</Button>
				</div>
				<div className="mt-4 text-center text-sm">
					Don't have an account?{" "}
					<Link href="/sign-up" className="underline">
						Sign up
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
