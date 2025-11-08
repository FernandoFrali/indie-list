import type { RatingsApi } from "@/app/lib/types/rating";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { Star } from "lucide-react";

export default async function Reviews({
  ratings,
  type,
}: { ratings: { data: RatingsApi }; type?: "user" | "content" }) {
  return (
    <>
      <div className="flex items-center bg-[#2A2A2A] px-2 py-3 md:px-3 rounded-sm text-c1 gap-1">
        <Star className="text-[#F0B100] size-3 md:size-4" />
        {ratings?.data?.[0].totalRatings > 0 ? (
          <p className="text-xs md:text-base font-medium leading-6">
            {ratings.data?.[0].totalRatings > 1
              ? `${ratings.data?.[0].totalRatings} avaliações ${type === "user" ? "feitas" : ""}`
              : `1 avaliação ${type === "user" ? "feita" : ""}`}
          </p>
        ) : (
          <p className="text-xs md:text-base font-medium leading-6">Nenhuma avaliação</p>
        )}
      </div>

      <div className="flex gap-5 flex-col">
        {ratings.data.map((rating) => (
          <div
            key={rating.id}
            className="flex gap-2 bg-c1 rounded-md p-6 items-center min-w-60 w-60 md:w-175"
          >
            <div className="flex flex-col text-c14 gap-2">
              <p className="text-2xl font-semibold line-clamp-3 max-w-50">
                {type === "user" ? rating.contentTitle : rating.userName}
              </p>
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
    </>
  );
}
