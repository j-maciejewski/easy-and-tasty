import SampleImage from "@/public/mock/meals/sample-image.jpg";

export const recipeImageSrcParser = (image: string | null) => {
  if (!image) return SampleImage;

  if (image.startsWith("http") || image.startsWith("https")) return image;

  return `/mock/meals/${image}`;
};
