import { useRef, useState } from "react";
import { createImageUrl, revokeImageUrl, validateImageFile } from "@/lib/utils/image";
import Image from "next/image";
import ImageCropper from "../image-cropper";

type Props = {
  onChange: (value: string) => void;
};

export function BannerField({ onChange }: Props) {
  const [showCropper, setShowCropper] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBannerChange = async (file: File | null) => {
    if (!file) {
      setBannerPreview(null);
      onChange("");
      return;
    }

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      alert(validation.error);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    const imageUrl = createImageUrl(file);
    setTempImageUrl(imageUrl);
    setShowCropper(true);
  };

  const handleCropComplete = (croppedBase64: string) => {
    setBannerPreview(croppedBase64);
    onChange(croppedBase64);
    setShowCropper(false);

    if (tempImageUrl) {
      revokeImageUrl(tempImageUrl);
      setTempImageUrl(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropCancel = () => {
    setShowCropper(false);

    if (tempImageUrl) {
      revokeImageUrl(tempImageUrl);
      setTempImageUrl(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div className="relative w-fit h-fit">
        <div className="relative w-full h-[100px] rounded-xl overflow-hidden">
          <Image
            unoptimized
            src={bannerPreview || "/images/banner-indielist.webp"}
            alt="Banner"
            width={1200}
            height={100}
            className="w-full h-full object-cover"
            priority
          />

          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%)",
            }}
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <label className="w-fit h-fit flex items-center justify-center !cursor-pointer">
            <div className="flex items-center justify-center bg-white rounded-full text-sm text-c12 hover:bg-white/80 transition-shadow !py-1 !px-4">
              Alterar imagem
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => {
                return handleBannerChange(e.target.files?.[0] || null);
              }}
            />
          </label>
        </div>
      </div>

      {showCropper && tempImageUrl && (
        <ImageCropper
          imageSrc={tempImageUrl}
          onCrop={handleCropComplete}
          onCancel={handleCropCancel}
          cropWidth={1920}
          cropHeight={400}
          maintainAspectRatio={true}
        />
      )}
    </>
  );
}
