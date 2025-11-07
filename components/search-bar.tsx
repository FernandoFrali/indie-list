"use client";

import { Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";

export default function SearchBar({ q }: { q?: string }) {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(q || "");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchValue.trim() || searchValue === "") {
      const params = new URLSearchParams(searchParams);
      params.set("q", searchValue.trim());
      router.push(`/?${params.toString()}`);
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-transparent cursor-pointer hover:opacity-80"
        aria-label="Abrir busca"
        type="button"
      >
        <Search size={24} className="md:hidden" />
        <p className="hidden text-c1 hover:underline text-base md:block">Pesquisar</p>
      </button>
    );
  }

  return (
    <div className="fixed top-5 left-5 md:left-auto md:right-5">
      <Input
        ref={inputRef}
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onBlur={handleSearch}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch(e);
          }
        }}
        placeholder="Buscar séries..."
        className="bg-white outline-none flex-1 text-sm placeholder:text-c12/50 text-c12 w-[calc(100vw-40px)] md:w-[250px]"
      />
      <Search size={20} className="text-c12 absolute right-2 top-2" />
    </div>
  );
}
