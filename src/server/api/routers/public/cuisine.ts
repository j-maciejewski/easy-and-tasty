import { env } from "@/env";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { cuisines } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const publicCuisineRouter = createTRPCRouter({
	getCuisines: publicProcedure.query(({ ctx }) => {
		if (env.MOCK_MODE) return GET_CUISINES_MOCK;

		return ctx.db.query.cuisines.findMany({
			orderBy: (cuisines, { desc }) => [desc(cuisines.name)],
		});
	}),

	getCuisineBySlug: publicProcedure
		.input(z.string())
		.query(({ ctx, input: cuisineSlug }) => {
			if (env.MOCK_MODE)
				return GET_CUISINES_MOCK.find(
					(cuisine) => cuisine.slug === cuisineSlug,
				);

			return ctx.db.query.cuisines.findFirst({
				where: eq(cuisines.slug, cuisineSlug),
			});
		}),
});

/* ======== MOCKS ======== */

const GET_CUISINES_MOCK = [
	{
		id: 1,
		name: "Italian",
		description:
			"Known for pasta, pizza, and rich sauces like marinara and pesto.",
		slug: "italian",
	},
	{
		id: 2,
		name: "Chinese",
		description:
			"Famous for stir-fries, dumplings, and a balance of sweet and savory flavors.",
		slug: "chinese",
	},
	{
		id: 3,
		name: "Mexican",
		description: "Spicy and flavorful dishes like tacos, burritos, and salsas.",
		slug: "mexican",
	},
	{
		id: 4,
		name: "Indian",
		description:
			"Rich, aromatic spices used in curries, biryanis, and tandoori dishes.",
		slug: "indian",
	},
	{
		id: 5,
		name: "Japanese",
		description:
			"Fresh ingredients in sushi, ramen, and tempura, with an emphasis on simplicity.",
		slug: "japanese",
	},
	{
		id: 6,
		name: "Thai",
		description:
			"Famous for its balance of sweet, sour, salty, and spicy flavors in dishes like pad Thai and curries.",
		slug: "thai",
	},
	{
		id: 7,
		name: "French",
		description:
			"Sophisticated cuisine known for techniques like sautéing and sauces like béchamel and hollandaise.",
		slug: "french",
	},
	{
		id: 8,
		name: "Spanish",
		description:
			"Known for tapas, paella, and the use of olive oil and fresh seafood.",
		slug: "spanish",
	},
	{
		id: 9,
		name: "Greek",
		description:
			"Mediterranean cuisine rich in olive oil, herbs, lamb, and dishes like moussaka and souvlaki.",
		slug: "greek",
	},
	{
		id: 10,
		name: "Korean",
		description:
			"Spicy, fermented flavors in dishes like kimchi, bibimbap, and Korean BBQ.",
		slug: "korean",
	},
	{
		id: 11,
		name: "Vietnamese",
		description:
			"Light, fresh flavors with an emphasis on herbs, in dishes like pho and spring rolls.",
		slug: "vietnamese",
	},
	{
		id: 12,
		name: "Lebanese",
		description:
			"Middle Eastern cuisine with dishes like hummus, falafel, and kebabs.",
		slug: "lebanese",
	},
	{
		id: 13,
		name: "Turkish",
		description:
			"Known for kebabs, mezes, and baklava, with a balance of sweet and savory.",
		slug: "turkish",
	},
	{
		id: 14,
		name: "American",
		description:
			"A melting pot of global influences, known for burgers, steaks, and BBQ.",
		slug: "american",
	},
	{
		id: 15,
		name: "Brazilian",
		description:
			"Famous for grilled meats, stews like feijoada, and tropical flavors.",
		slug: "brazilian",
	},
	{
		id: 16,
		name: "Ethiopian",
		description:
			"Spicy stews served on injera, a sour flatbread, and communal dining traditions.",
		slug: "ethiopian",
	},
	{
		id: 17,
		name: "Moroccan",
		description:
			"Spiced dishes like tagine, couscous, and rich stews with dried fruits and nuts.",
		slug: "moroccan",
	},
	{
		id: 18,
		name: "Peruvian",
		description:
			"Known for ceviche, potatoes, and a unique blend of indigenous and European flavors.",
		slug: "peruvian",
	},
	{
		id: 19,
		name: "Caribbean",
		description:
			"Vibrant, tropical flavors with influences from Africa, Europe, and indigenous cultures, including jerk seasoning.",
		slug: "caribbean",
	},
	{
		id: 20,
		name: "Indonesian",
		description:
			"Rich and spicy dishes like nasi goreng, satay, and rendang, with coconut and chili influences.",
		slug: "indonesian",
	},
];
