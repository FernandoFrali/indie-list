import { getContents } from "@/app/lib/content";
import Link from "next/link";

export async function ContentsList({ q }: { q?: string }) {
  "use cache";
  const contents = await getContents(q)
    .then((res) => res.data)
    .catch(() => []);

  return (
    <>
      <h1 className="text-c1 text-base font-medium">
        {q ? (
          <>
            <span className="text-c5">{contents?.length || 0}</span> Séries encontradas:
          </>
        ) : (
          <>
            As melhores séries <span className="text-c5">indies</span> do momento:
          </>
        )}
      </h1>
      {contents?.length ? (
        <section className="grid grid-cols-[repeat(auto-fill,100px)] md:grid-cols-[repeat(auto-fill,200px)] gap-5 w-full p-5 items-center justify-center">
          {contents.map((content) => (
            <Link
              key={content.id}
              className="flex items-end h-35 flex-1 w-25 py-2 md:w-50 md:h-75 bg-no-repeat bg-cover bg-center hover:scale-105 transition-transform rounded-md md:pr-2"
              style={{
                backgroundImage: `url(${content.thumbnail})`,
              }}
              href={`/contents/${content.slug}`}
            >
              <div className="w-full bg-black/50 px-2 py-1 md:rounded-r-md">
                <p className="text-xs line-clamp-4 wrap-break-word">{content.title}</p>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <p className="text-c1 text-xl font-medium text-center w-full">
          {q ? `Nenhuma série encontrada para "${q}"` : "Nenhuma série encontrada"}
        </p>
      )}
    </>
  );
}
