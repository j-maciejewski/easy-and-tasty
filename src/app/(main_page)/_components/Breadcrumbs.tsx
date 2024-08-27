import clsx from "clsx";
import Link from "next/link";

namespace Breadcrumbs {
	export interface Props {
		paths: Array<{
			label: string;
			href?: string;
			active?: boolean;
		}>;
	}
}

export const Breadcrumbs = ({ paths }: Breadcrumbs.Props) => {
	if (paths.length === 0) return null;

	return (
		<ul className="flex mb-8 text-gray-600">
			<li className="items-center font-semibold">
				<Link href="/" className="hover:text-gray-800">
					Home
				</Link>
			</li>
			{paths.map((path) => (
				<li
					key={path.label}
					className="pl-1 before:content-['\00BB'] before:mr-1 items-end font-semibold"
				>
					{path.href ? (
						<Link href={path.href} className="hover:text-black">
							{path.label}
						</Link>
					) : (
						<span className={clsx({ "text-black": path.active })}>
							{path.label}
						</span>
					)}
				</li>
			))}
		</ul>
	);
};
