"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import Modal from "./modal";
import InputField from "./form/input";
import { signIn, signOut, signUp, useSession } from "@/app/lib/auth-client";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useRouter } from "next/navigation";

export default function Login() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const router = useRouter();

  const logout = async () => {
    await signOut().then(() => {
      setIsOpen(false);
      setIsSignUpOpen(false);

      router.refresh();
      toast.success("Sessão encerrada!");
    });
  };

  const signInUser = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          toast.success("Login efetuado com sucesso!");
          setIsLoading(false);
          setIsOpen(false);

          router.refresh();
        },
        onError: (ctx) => {
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
  };

  const signUpUser = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as "consumer" | "publisher";

    await signUp.email(
      {
        email,
        password,
        name,
        role,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          toast.success("Cadastro efetuado com sucesso!");
          setIsLoading(false);
          setIsSignUpOpen(false);

          router.refresh();
        },
        onError: (ctx) => {
          toast.error(`Ocorreu um erro ao cadastrar: ${ctx.error.message || ctx.error.statusText}`);
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <div>
      {session?.isPending ? (
        <p className="text-c1 animate-pulse">Carregando...</p>
      ) : session?.data?.user ? (
        <button
          className="bg-transparent hover:underline text-c1 cursor-pointer"
          onClick={() => logout()}
          type="button"
        >
          Sair
        </button>
      ) : (
        <Button className="!font-semibold" onClick={() => setIsOpen(true)}>
          Entrar
        </Button>
      )}

      <Modal title="Entre na sua conta" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col gap-5">
          <form
            className="flex flex-col gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              await signInUser(formData);
            }}
          >
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
            <p className="text-sm text-c14">Não tem cadastro?</p>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setIsSignUpOpen(true);
              }}
              className="bg-c8 hover:bg-c9 text-c1 font-semibold py-2 px-4 rounded-sm text-sm cursor-pointer"
            >
              Cadastre-se
            </button>
          </div>
        </div>
      </Modal>

      <Modal title="Cadastre-se" isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)}>
        <div className="flex flex-col gap-5">
          <form
            className="flex flex-col gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              await signUpUser(formData);
            }}
          >
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

            <div className="flex flex-col gap-1.5 text-c14">
              <p className="font-medium">Você vai publicar conteúdo ou avaliar?</p>
              <RadioGroup name="role" defaultValue="consumer">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="consumer" id="r1" />
                  <label htmlFor="r1" className="cursor-pointer">
                    Avaliar
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <RadioGroupItem value="publisher" id="r2" />
                  <label htmlFor="r2" className="cursor-pointer">
                    Criar
                  </label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="!font-semibold">
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
