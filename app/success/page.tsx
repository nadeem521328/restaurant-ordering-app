import Link from "next/link";

export default async function SuccessPage({
  searchParams
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center px-4 py-8">
      <div className="mx-auto w-full max-w-xl rounded-lg bg-white p-6 text-center ring-1 ring-green-100">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl font-black text-green-700">
          OK
        </div>
        <h1 className="mt-5 text-3xl font-black text-gray-950">
          Order placed
        </h1>
        {params.order ? (
          <p className="mt-2 text-lg font-bold text-gray-700">
            Order #{params.order}
          </p>
        ) : null}
        <p className="mt-3 text-gray-600">
          Restaurant will call if they need directions.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-red-700 px-5 font-bold text-white"
        >
          Back to menu
        </Link>
      </div>
    </main>
  );
}
