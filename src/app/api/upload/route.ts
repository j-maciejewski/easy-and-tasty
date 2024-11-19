import { UTApi } from "uploadthing/server";

export async function POST(req: Request) {
	const utapi = new UTApi();
	const formData = await req.formData();
	const file = formData.get("file");

	const response = await utapi.uploadFiles(file as File);

	if (response.data)
		return Response.json({
			data: { name: response.data.name, url: response.data.url },
			error: null,
		});

	return Response.json(
		{ data: null, error: response.error.message },
		{ status: 201 },
	);
}
