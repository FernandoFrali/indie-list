"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function WatchAtButton({
  streamingList,
}: { streamingList: { name: string; url: string }[] }) {
  const [selectedStreaming, setSelectedStreaming] = useState(streamingList[0]);

  if (!streamingList.length) return null;

  return (
    <div className="grid grid-cols-[1fr_min-content] md:grid-cols-[min-content_min-content] items-center gap-1 w-full h-10">
      <Button className="!leading-6 !h-full">
        <a href={selectedStreaming.url} target="_blank" rel="noreferrer">
          Assista em: <span className="font-semibold tracking-tight">{selectedStreaming.name}</span>
        </a>
      </Button>

      {streamingList.length > 1 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="!h-full">
              <ChevronDown size={20} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel className="text-c1">Selecione o streaming</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {streamingList.map((streaming) => (
              <DropdownMenuCheckboxItem
                key={streaming.name}
                checked={streaming.name === selectedStreaming.name}
                onCheckedChange={(checked) => {
                  setSelectedStreaming(checked ? streaming : streamingList[0]);
                }}
                className="text-c1"
              >
                {streaming.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
