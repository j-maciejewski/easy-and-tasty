namespace Ingredients {
	export interface Props {
		ingredientsGroups: unknown[];
	}
}

export const Ingredients = ({ ingredientsGroups }: Ingredients.Props) => {
	return (
		<div className="shadow bg-white rounded-lg p-5">
			<h6 className="text-lg font-semibold mb-3">Ingredients</h6>
			{/* @ts-ignore */}
			{ingredientsGroups.map(({ label, ingredients }) => (
				<div key={label} className="mb-3 last:mb-0">
					{ingredientsGroups.length > 1 && (
						<p className="mb-2 text-base">{label}</p>
					)}
					<ul>
						{/* @ts-ignore */}
						{ingredients.map((ingredient, idx) => (
							<li
								// @ts-ignore
								key={idx}
								className="mx-2 flex items-center mb-1 last:mb-0"
							>
								<input type="checkbox" className="accent-primary mr-3 size-4" />
								<span>{ingredient}</span>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
};
