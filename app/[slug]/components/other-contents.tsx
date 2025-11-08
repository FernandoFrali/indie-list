import { getContents } from "@/app/lib/content";
import Link from "next/link";

export default async function OtherContents() {
  const contents = await getContents(undefined, "2");

  if (contents.error) {
    return (
      <p className="text-c1 text-sm font-medium">Erro ao carregar os conteúdos: {contents.error}</p>
    );
  }

  if (!contents?.data?.length) {
    return <p className="text-c1 text-sm font-medium">Nenhum conteúdo encontrado</p>;
  }

  return (
    <div className="flex gap-5 overflow-x-auto">
      {contents.data.map((content) => (
        <Link
          key={content.id}
          className="flex items-end h-62.5 flex-1 min-w-37.5 max-w-37.5 py-2 bg-no-repeat bg-cover bg-center transition-transform rounded-md pr-2"
          style={{
            backgroundImage: `url(${content.thumbnail})`,
          }}
          href={`/${content.slug}`}
        >
          <div className="w-full bg-black/50 px-2 py-1 rounded-r-md">
            <p className="text-xs line-clamp-4 truncate">{content.title}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
