"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import Modal from "./modal";
import InputField from "./form/input";
import { signIn, signUp } from "@/app/lib/auth-client";
import { toast } from "sonner";

export default function Login() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const signInUser = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data } = await signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          toast.success("Cadastro efetuado com sucesso!");
          setIsLoading(false);
        },
        onError: (ctx) => {
          console.log(ctx.error);
          if (ctx.error.status === 401) {
            toast.error("Email ou senha incorretos");
            setIsLoading(false);
            return;
          }

          if (ctx.error.status === 404) {
            toast.error("Usuário não encontrado");
            setIsLoading(false);
            return;
          }

          toast.error(`Ocorreu um erro ao entrar: ${ctx.error.message || ctx.error.statusText}`);
          setIsLoading(false);
        },
      },
    );

    console.log(data);
  };

  const signUpUser = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as "consumer" | "publisher";
    const image = formData.get("image") as string | undefined;

    const { data } = await signUp.email(
      {
        email,
        password,
        name,
        role,
        image,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          toast.success("Cadastro efetuado com sucesso!");
          setIsLoading(false);
        },
        onError: (ctx) => {
          // apagar imagem do local
          toast.error(ctx.error.message);
          setIsLoading(false);
        },
      },
    );

    console.log(data);
  };

  return (
    <div>
      <Button className="!font-semibold" onClick={() => setIsOpen(true)}>
        Entrar
      </Button>

      <Modal title="Entre na sua conta" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col gap-5">
          <form className="flex flex-col gap-3" action={signInUser}>
            <InputField
              label="Email"
              name="email"
              required
              description="Digite seu e-mail"
              type="email"
            />
            <InputField
              label="Senha"
              name="password"
              required
              description="Digite sua senha"
              type="password"
            />
            <Button type="submit" className="!font-semibold">
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="flex items-center gap-3 self-center">
            <p className="text-sm text-c10">Não tem cadastro?</p>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setIsSignUpOpen(true);
              }}
              className="bg-c8 hover:bg-c9 text-c1 font-semibold py-2 px-4 rounded-sm text-sm"
            >
              Cadastre-se
            </button>
          </div>
        </div>
      </Modal>

      <Modal title="Cadastre-se" isOpen={isSignUpOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col gap-5">
          <form className="flex flex-col gap-3" action={signUpUser}>
            <InputField
              label="Nome *"
              name="name"
              required
              description="Digite seu nome de usuário"
            />
            <InputField
              label="Email *"
              name="email"
              required
              description="Digite seu e-mail"
              type="email"
            />
            <InputField
              label="Senha *"
              name="password"
              required
              description="Digite sua senha"
              type="password"
            />
            <Button type="submit" className="!font-semibold">
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
