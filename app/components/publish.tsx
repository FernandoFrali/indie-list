"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Modal from "@/components/modal";
import InputField from "@/components/form/input";
import { BannerField } from "@/components/form/banner";
import { Checkbox } from "@/components/ui/checkbox";
import { createContent } from "../lib/content";
import { ThumbnailField } from "@/components/form/thumbnail";

export default function PublishIndieForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [services, setServices] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<string>("");
  const [banner, setBanner] = useState<string>("");

  const handleServiceToggle = (service: string) => {
    setServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service],
    );
  };

  const handleSubmit = async (formData: FormData) => {
    if (!thumbnail || !banner) {
      toast.error("Por favor, adicione thumbnail e banner");
      return;
    }

    setIsLoading(true);

    try {
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const youtubeUrl =
        (services.includes("YouTube") && (formData.get("youtubeUrl") as string)) || undefined;
      const netflixUrl =
        (services.includes("Netflix") && (formData.get("netflixUrl") as string)) || undefined;
      const hboUrl = (services.includes("HBO") && (formData.get("hboUrl") as string)) || undefined;
      const amazonUrl =
        (services.includes("Amazon Prime") && (formData.get("amazonUrl") as string)) || undefined;
      const disneyUrl =
        (services.includes("Disney+") && (formData.get("disneyUrl") as string)) || undefined;
      const otherStreaming =
        (services.includes("Outro (informar o nome)") &&
          (formData.get("otherSreaming") as string)) ||
        undefined;
      const otherStreamingUrl =
        (services.includes("Outro (informar o nome)") &&
          (formData.get("otherSreamingUrl") as string)) ||
        undefined;

      await createContent({
        title,
        description,
        thumbnail,
        banner,
        youtubeUrl,
        netflixUrl,
        hboUrl,
        amazonUrl,
        disneyUrl,
        otherStreaming,
        otherStreamingUrl,
      });

      toast.success("Indie publicado com sucesso!");
      setIsOpen(false);

      setThumbnail("");
      setBanner("");
      setServices([]);
    } catch (error) {
      toast.error("Erro ao publicar indie");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Publique seu indie</Button>

      <Modal title="Publique seu indie" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            await handleSubmit(formData);
          }}
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-1.5 text-c14">
            <p className="block font-medium">Banner *</p>
            <BannerField onChange={setBanner} />
          </div>

          <div className="flex flex-col gap-1.5 text-c14">
            <p className="block font-medium">Thumbnail *</p>
            <ThumbnailField onChange={setThumbnail} />
          </div>

          <InputField
            label="Descrição *"
            name="description"
            required
            description="Coloque uma 'mini-sinopse' do seu indie"
          />

          <InputField
            label="Título *"
            name="title"
            required
            description="Digite o nome de sua obra"
          />

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-c14">
              Em quais serviços a série está disponível?
            </p>
            <div className="flex flex-col gap-2">
              {[
                "YouTube",
                "Netflix",
                "HBO",
                "Amazon Prime",
                "Disney+",
                "Outro (informar o nome)",
              ].map((service) => (
                <label
                  key={service}
                  className="flex items-center gap-2 cursor-pointer"
                  htmlFor={service}
                >
                  <Checkbox
                    id={service}
                    checked={services.includes(service)}
                    onCheckedChange={() => handleServiceToggle(service)}
                    className="w-4 h-4 bg-white"
                  />
                  <span className="text-sm text-c14">{service}</span>
                </label>
              ))}
            </div>
          </div>

          {services.includes("YouTube") && (
            <InputField
              label="Link do YouTube *"
              name="youtubeUrl"
              required
              description="Digite o link da sua obra no YouTube"
            />
          )}

          {services.includes("Netflix") && (
            <InputField
              label="Link do Netflix *"
              name="netflixUrl"
              required
              description="Digite o link da sua obra no Netflix"
            />
          )}

          {services.includes("HBO") && (
            <InputField
              label="Link do HBO *"
              name="hboUrl"
              required
              description="Digite o link da sua obra no HBO"
            />
          )}

          {services.includes("Amazon Prime") && (
            <InputField
              label="Link do Amazon Prime *"
              name="amazonUrl"
              required
              description="Digite o link da sua obra no Amazon Prime"
            />
          )}

          {services.includes("Disney+") && (
            <InputField
              label="Link do Disney+ *"
              name="disneyUrl"
              required
              description="Digite o link da sua obra no Disney+"
            />
          )}

          {services.includes("Outro (informar o nome)") && (
            <InputField
              label="Nome do serviço de streaming *"
              name="otherSreaming"
              required
              description="Digite o nome do outro serviço de streaming"
            />
          )}

          {services.includes("Outro (informar o nome)") && (
            <InputField
              label="Link do outro serviço de streaming *"
              name="otherSreamingUrl"
              required
              description="Digite o link da sua obra"
            />
          )}

          <Button type="submit" className="!font-semibold w-full">
            {isLoading ? "Publicando..." : "Publicar"}
          </Button>
        </form>
      </Modal>
    </>
  );
}
