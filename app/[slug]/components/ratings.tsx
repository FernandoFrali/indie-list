import { getRatings } from "@/app/lib/rating";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";

export default async function Ratings({ contentSlug }: { contentSlug: string }) {
  const ratings = await getRatings(contentSlug);

  if (ratings.error) {
    return (
      <p className="text-c1 text-sm font-medium">Erro ao carregar as avaliações: {ratings.error}</p>
    );
  }

  if (!ratings?.data?.length) {
    return <p className="text-c1 text-sm font-medium">Nenhuma avaliação encontrada</p>;
  }

  return (
    <div className="flex gap-5 overflow-x-auto">
      {ratings.data.map((rating) => (
        <div
          key={rating.id}
          className="flex gap-2 bg-c1 rounded-md p-6 items-center min-w-60 w-60 md:w-112.5"
        >
          <div className="flex flex-col text-c14 gap-2">
            <p className="text-2xl font-semibold line-clamp-3 max-w-50">{rating.userName}</p>
            <p className="text-base max-w-50 break-words">{rating.description}</p>
            <Rating value={rating.stars} readOnly>
              {Array.from({ length: 5 }).map((_, index) => (
                <RatingButton
                  className="text-[#F0B100] bg-transparent"
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={index}
                />
              ))}
            </Rating>
          </div>
        </div>
      ))}
    </div>
  );
}
