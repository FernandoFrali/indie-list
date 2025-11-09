"use client";

import { useSession } from "@/app/lib/auth-client";
import { getUserRating, rateContent, updateRating } from "@/app/lib/rating";
import { Button } from "@/components/ui/button";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Rate({
  contentSlug,
}: {
  contentSlug: string;
}) {
  const { data: session } = useSession();
  const hasUser = !!session?.user?.id;
  const [hasRated, setHasRated] = useState(false);
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (hasUser) {
      getUserRating(contentSlug).then((res) => {
        if ("error" in res && res.error) {
          toast.error(`Erro ao buscar avaliação: ${res.error}`);
          return;
        }

        if (res?.data?.stars) {
          setRating(res?.data?.stars);
          setDescription(res?.data?.description || undefined);
          setHasRated(true);
        }
      });
    }
  }, [session?.user?.id]);

  const handleRateContent = async () => {
    try {
      setIsLoading(true);

      const res = hasRated
        ? await updateRating(rating, contentSlug, description)
        : await rateContent(rating, contentSlug, description);

      if ("error" in res && res.error) {
        throw new Error(res.error || "Erro ao avaliar o conteúdo");
      }

      setIsLoading(false);
      setIsModalOpen(false);

      toast.success("Conteúdo avaliado com sucesso");
    } catch (error: any) {
      setIsLoading(false);
      toast.error(`Erro ao avaliar o conteúdo: ${error.message}`);
    }
  };

  if (!hasUser) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-1 relative">
      <Rating
        value={rating}
        onValueChange={(value) => {
          setRating(value);
          setIsModalOpen(true);
        }}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <RatingButton
            className="text-[#F0B100] bg-transparent"
            iconClassName="!h-6 !w-6"
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
          />
        ))}
      </Rating>
      <span className="text-xs font-medium">Sua nota: {rating}</span>

      {isModalOpen && (
        <div className="flex flex-col absolute top-7 gap-2 px-4 py-3 rounded-sm bg-c2 w-[calc(100svw-20px)] md:w-140 md:left-0">
          <span className="text-xs font-medium text-c12 md:text-base">
            Você deu {rating} estrelas! Clique em “Enviar” para finalizar a avaliação.
          </span>
          <Textarea
            placeholder="Descreva sua avaliação (opcional)"
            className="bg-white text-c14"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <Button
              className="w-fit bg-c1 border-c14 border text-c14 hover:bg-c12 hover:text-c1"
              onClick={() => {
                setRating(0);
                setIsModalOpen(false);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={() => handleRateContent()} className="w-fit">
              {isLoading ? "Enviando..." : "Enviar"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
