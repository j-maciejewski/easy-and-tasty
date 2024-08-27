import bbq from "@/public/mock/meals/bbq.jpg";
import Image from "next/image";
import { Breadcrumbs } from "../_components";

const ALL_CATEGORIES = [
	"Breakfast",
	"Brunch",
	"Lunch",
	"Dinner",
	"Pancakes",
	"Sandwiches, Wraps and Rolls",
	"Appetisers",
	"Soups",
	"Salads",
	"Sides",
	"Snacks",
	"Burgers",
	"Pizza",
	"Pies",
	"Quiches and Savoury Tarts",
	"Mince",
	"Lamb",
	"Chicken",
	"Seafood",
	"Rice",
	"Noodles",
	"Pasta",
	"Sausages",
	"Beef",
	"Stir Fry",
	"Pork",
	"Turkey",
	"Duck",
	"Condiments and Spreads",
	"Sauces",
	"Bread",
	"Slices",
	"Muffins, Scones and Scrolls",
	"Biscuits and Cookies",
	"Treats",
	"Baking",
	"Desserts",
	"Cheesecakes",
	"Ice Cream",
	"Smoothies and Shakes",
	"Drinks and Cocktails",
	"Vegetarian",
	"Poultry",
	"Meat",
];

export default async function () {
	return (
		<div className="pt-6 max-xl:px-[3vw] w-full">
			<Breadcrumbs paths={[{ label: "All Recipes", active: true }]} />

			<div className="gap-4 grid grid-cols-[repeat(auto-fill,_minmax(225px,_1fr))]">
				{ALL_CATEGORIES.map((category) => (
					<div
						key={category}
						className="min-w-[225px] shadow-lg rounded-lg bg-white grow"
					>
						<Image
							src={bbq}
							className="aspect-square object-cover rounded-t-lg w-full"
							alt="category"
						/>
						<h5 className="text-center font-semibold my-2 text-lg">
							{category}
						</h5>
					</div>
				))}
			</div>
		</div>
	);
}
