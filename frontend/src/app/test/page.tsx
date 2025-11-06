import Image from "next/image";

export default async function Test() {
  let status: number | null = null;
  let ok: boolean | null = null;
  let bodySnippet: string | null = null;
  let error: string | null = null;

  try {
    // server-side fetch to the Laravel backend at http://localhost/
    const res = await fetch("http://localhost/", { cache: "no-store" });
    status = res.status;
    ok = res.ok;
    const text = await res.text();
    // limit the amount of body we render
    bodySnippet = text ? text.slice(0, 1000) : null;
  } catch (err: any) {
    error = err?.message ?? String(err);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white sm:items-start">
        <h1 className="text-2xl font-semibold mb-4">Simple fetch to http://localhost/</h1>

        {error ? (
          <div className="text-red-600">Error: {error}</div>
        ) : (
          <div className="w-full bg-zinc-100 p-4 rounded text-black">
            <p>
              Status: <strong>{status ?? "—"}</strong> — OK: <strong>{String(ok)}</strong>
            </p>
            {bodySnippet ? (
              <pre className="mt-2 max-h-64 overflow-auto text-sm whitespace-pre-wrap">{bodySnippet}</pre>
            ) : (
              <p className="mt-2 text-sm text-zinc-500">No body returned (or empty)</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
