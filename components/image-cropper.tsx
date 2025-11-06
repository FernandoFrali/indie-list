"use client";

import { useRef, useState, useEffect } from "react";
import Modal from "./modal";
import { Button } from "./ui/button";

interface ImageCropperProps {
  imageSrc: string;
  onCrop: (croppedBase64: string) => void;
  onCancel: () => void;
  cropWidth?: number;
  cropHeight?: number;
  maintainAspectRatio?: boolean;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function ImageCropper({
  imageSrc,
  onCrop,
  onCancel,
  cropWidth = 200,
  cropHeight = 200,
  maintainAspectRatio = false,
}: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const targetAspectRatio = cropWidth / cropHeight;

  useEffect(() => {
    if (imageLoaded && canvasRef.current && imageRef.current) {
      drawCanvas();
    }
  }, [cropArea, imageLoaded]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.clearRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
    ctx.drawImage(
      image,
      (cropArea.x / canvas.width) * image.naturalWidth,
      (cropArea.y / canvas.height) * image.naturalHeight,
      (cropArea.width / canvas.width) * image.naturalWidth,
      (cropArea.height / canvas.height) * image.naturalHeight,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height,
    );

    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);

    const handleSize = 8;
    ctx.fillStyle = "#3b82f6";

    ctx.fillRect(
      cropArea.x + cropArea.width - handleSize / 2,
      cropArea.y + cropArea.height - handleSize / 2,
      handleSize,
      handleSize,
    );

    ctx.fillRect(cropArea.x - handleSize / 2, cropArea.y - handleSize / 2, handleSize, handleSize);

    ctx.fillRect(
      cropArea.x + cropArea.width - handleSize / 2,
      cropArea.y - handleSize / 2,
      handleSize,
      handleSize,
    );

    ctx.fillRect(
      cropArea.x - handleSize / 2,
      cropArea.y + cropArea.height - handleSize / 2,
      handleSize,
      handleSize,
    );
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const isInCropArea = (x: number, y: number) => {
    return (
      x >= cropArea.x &&
      x <= cropArea.x + cropArea.width &&
      y >= cropArea.y &&
      y <= cropArea.y + cropArea.height
    );
  };

  const getResizeHandle = (x: number, y: number) => {
    const handleSize = 8;
    const tolerance = handleSize / 2;

    if (
      Math.abs(x - (cropArea.x + cropArea.width)) <= tolerance &&
      Math.abs(y - (cropArea.y + cropArea.height)) <= tolerance
    ) {
      return "bottom-right";
    }
    if (Math.abs(x - cropArea.x) <= tolerance && Math.abs(y - cropArea.y) <= tolerance) {
      return "top-left";
    }
    if (
      Math.abs(x - (cropArea.x + cropArea.width)) <= tolerance &&
      Math.abs(y - cropArea.y) <= tolerance
    ) {
      return "top-right";
    }
    if (
      Math.abs(x - cropArea.x) <= tolerance &&
      Math.abs(y - (cropArea.y + cropArea.height)) <= tolerance
    ) {
      return "bottom-left";
    }

    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    setDragStart(pos);

    const resizeHandle = getResizeHandle(pos.x, pos.y);
    if (resizeHandle) {
      setIsResizing(true);

      (e.currentTarget as any).resizeHandle = resizeHandle;
    } else if (isInCropArea(pos.x, pos.y)) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDragging) {
      const deltaX = pos.x - dragStart.x;
      const deltaY = pos.y - dragStart.y;

      const newX = Math.max(0, Math.min(canvas.width - cropArea.width, cropArea.x + deltaX));
      const newY = Math.max(0, Math.min(canvas.height - cropArea.height, cropArea.y + deltaY));

      setCropArea((prev) => ({ ...prev, x: newX, y: newY }));
      setDragStart(pos);
    } else if (isResizing) {
      const handle = (e.currentTarget as any).resizeHandle;
      const newCropArea = { ...cropArea };

      switch (handle) {
        case "bottom-right": {
          newCropArea.width = Math.max(50, Math.min(pos.x - cropArea.x, canvas.width - cropArea.x));
          newCropArea.height = Math.max(
            50,
            Math.min(pos.y - cropArea.y, canvas.height - cropArea.y),
          );
          break;
        }
        case "top-left": {
          const newX = Math.max(0, pos.x);
          const newY = Math.max(0, pos.y);
          newCropArea.width = cropArea.width + (cropArea.x - newX);
          newCropArea.height = cropArea.height + (cropArea.y - newY);
          newCropArea.x = newX;
          newCropArea.y = newY;
          break;
        }
        case "top-right": {
          newCropArea.width = Math.max(50, Math.min(pos.x - cropArea.x, canvas.width - cropArea.x));
          const newTopY = Math.max(0, pos.y);
          newCropArea.height = cropArea.height + (cropArea.y - newTopY);
          newCropArea.y = newTopY;
          break;
        }
        case "bottom-left": {
          const newLeftX = Math.max(0, pos.x);
          newCropArea.width = cropArea.width + (cropArea.x - newLeftX);
          newCropArea.height = Math.max(
            50,
            Math.min(pos.y - cropArea.y, canvas.height - cropArea.y),
          );
          newCropArea.x = newLeftX;
          break;
        }
      }

      if (maintainAspectRatio) {
        const currentRatio = newCropArea.width / newCropArea.height;
        if (currentRatio !== targetAspectRatio) {
          if (handle === "bottom-right" || handle === "top-left") {
            newCropArea.height = newCropArea.width / targetAspectRatio;
          } else {
            newCropArea.width = newCropArea.height * targetAspectRatio;
          }
        }
      }

      newCropArea.width = Math.min(newCropArea.width, canvas.width - newCropArea.x);
      newCropArea.height = Math.min(newCropArea.height, canvas.height - newCropArea.y);

      setCropArea(newCropArea);
    }

    const resizeHandle = getResizeHandle(pos.x, pos.y);
    if (resizeHandle) {
      const cursors = {
        "bottom-right": "nw-resize",
        "top-left": "nw-resize",
        "top-right": "ne-resize",
        "bottom-left": "ne-resize",
      };
      canvas.style.cursor = cursors[resizeHandle];
    } else if (isInCropArea(pos.x, pos.y)) {
      canvas.style.cursor = "move";
    } else {
      canvas.style.cursor = "default";
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleImageLoad = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const containerWidth = Math.min(window.innerWidth - 40, 800);
    const maxHeight = 600;

    let width = image.naturalWidth;
    let height = image.naturalHeight;

    const ratio = Math.min(containerWidth / width, maxHeight / height, 1);
    width = width * ratio;
    height = height * ratio;

    canvas.width = width;
    canvas.height = height;
    canvas.style.width = "100%";
    canvas.style.height = "auto";

    let initialWidth: number;
    let initialHeight: number;

    if (maintainAspectRatio) {
      const maxCropWidth = width * 0.8;
      const maxCropHeight = height * 0.8;

      if (targetAspectRatio > 1) {
        initialWidth = Math.min(maxCropWidth, maxCropHeight * targetAspectRatio);
        initialHeight = initialWidth / targetAspectRatio;
      } else {
        initialHeight = Math.min(maxCropHeight, maxCropWidth / targetAspectRatio);
        initialWidth = initialHeight * targetAspectRatio;
      }
    } else {
      initialWidth = Math.min(width * 0.6, 400);
      initialHeight = Math.min(height * 0.6, 300);
    }

    setCropArea({
      x: (width - initialWidth) / 2,
      y: (height - initialHeight) / 2,
      width: initialWidth,
      height: initialHeight,
    });

    setImageLoaded(true);
  };

  const handleCrop = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const cropCanvas = document.createElement("canvas");
    cropCanvas.width = cropWidth;
    cropCanvas.height = cropHeight;
    const cropCtx = cropCanvas.getContext("2d");
    if (!cropCtx) return;

    const scaleX = image.naturalWidth / canvas.width;
    const scaleY = image.naturalHeight / canvas.height;

    const sourceX = cropArea.x * scaleX;
    const sourceY = cropArea.y * scaleY;
    const sourceWidth = cropArea.width * scaleX;
    const sourceHeight = cropArea.height * scaleY;

    cropCtx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      cropWidth,
      cropHeight,
    );

    const croppedBase64 = cropCanvas.toDataURL("image/jpeg", 0.8);
    onCrop(croppedBase64);
  };

  const getTouchPos = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const pos = getTouchPos(e);
    setDragStart(pos);

    const resizeHandle = getResizeHandle(pos.x, pos.y);
    if (resizeHandle) {
      setIsResizing(true);
      (e.currentTarget as any).resizeHandle = resizeHandle;
    } else if (isInCropArea(pos.x, pos.y)) {
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const pos = getTouchPos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDragging) {
      const deltaX = pos.x - dragStart.x;
      const deltaY = pos.y - dragStart.y;

      const newX = Math.max(0, Math.min(canvas.width - cropArea.width, cropArea.x + deltaX));
      const newY = Math.max(0, Math.min(canvas.height - cropArea.height, cropArea.y + deltaY));

      setCropArea((prev) => ({ ...prev, x: newX, y: newY }));
      setDragStart(pos);
    } else if (isResizing) {
      const handle = (e.currentTarget as any).resizeHandle;
      const newCropArea = { ...cropArea };

      switch (handle) {
        case "bottom-right": {
          newCropArea.width = Math.max(50, Math.min(pos.x - cropArea.x, canvas.width - cropArea.x));
          newCropArea.height = Math.max(
            50,
            Math.min(pos.y - cropArea.y, canvas.height - cropArea.y),
          );
          break;
        }
        case "top-left": {
          const newX = Math.max(0, pos.x);
          const newY = Math.max(0, pos.y);
          newCropArea.width = cropArea.width + (cropArea.x - newX);
          newCropArea.height = cropArea.height + (cropArea.y - newY);
          newCropArea.x = newX;
          newCropArea.y = newY;
          break;
        }
        case "top-right": {
          newCropArea.width = Math.max(50, Math.min(pos.x - cropArea.x, canvas.width - cropArea.x));
          const newTopY = Math.max(0, pos.y);
          newCropArea.height = cropArea.height + (cropArea.y - newTopY);
          newCropArea.y = newTopY;
          break;
        }
        case "bottom-left": {
          const newLeftX = Math.max(0, pos.x);
          newCropArea.width = cropArea.width + (cropArea.x - newLeftX);
          newCropArea.height = Math.max(
            50,
            Math.min(pos.y - cropArea.y, canvas.height - cropArea.y),
          );
          newCropArea.x = newLeftX;
          break;
        }
      }

      if (maintainAspectRatio) {
        const currentRatio = newCropArea.width / newCropArea.height;
        if (currentRatio !== targetAspectRatio) {
          if (handle === "bottom-right" || handle === "top-left") {
            newCropArea.height = newCropArea.width / targetAspectRatio;
          } else {
            newCropArea.width = newCropArea.height * targetAspectRatio;
          }
        }
      }

      newCropArea.width = Math.min(newCropArea.width, canvas.width - newCropArea.x);
      newCropArea.height = Math.min(newCropArea.height, canvas.height - newCropArea.y);

      setCropArea(newCropArea);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  return (
    <Modal title="Editar imagem" isOpen={true} onClose={onCancel}>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="border border-gray-300 rounded"
          />
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Crop preview"
            onLoad={handleImageLoad}
            className="hidden"
          />
        </div>

        <div className="text-sm text-gray-600 text-center">
          <p>Arraste para mover a área de recorte</p>
          {maintainAspectRatio && (
            <p>
              Proporção: {cropWidth}x{cropHeight}
            </p>
          )}
        </div>
      </div>

      <div className="flex w-full items-center justify-center gap-5 mt-2">
        <Button
          onClick={onCancel}
          type="button"
          className="bg-transparent border border-c12 text-c12 hover:text-white transition-colors"
        >
          Descartar
        </Button>
        <Button onClick={handleCrop} type="button">
          Confirmar
        </Button>
      </div>
    </Modal>
  );
}
