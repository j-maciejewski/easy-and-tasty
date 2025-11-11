export default async function ({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const pageId = (await params).id;

  return <div className="mx-auto max-w-240">{pageId}</div>;
}
