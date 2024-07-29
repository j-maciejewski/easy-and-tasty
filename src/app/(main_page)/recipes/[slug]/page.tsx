export default async function ({ params }: { params: { slug: string } }) {
	return <>{JSON.stringify(params)}</>;
}
