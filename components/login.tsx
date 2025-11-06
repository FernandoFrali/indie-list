"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import Modal from "./modal";
import InputField from "./form/input";

export default function Login() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button className="!font-semibold" onClick={() => setIsOpen(true)}>
        Entrar
      </Button>

      <Modal title="Entre na sua conta" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col gap-5">
          <form
            className="flex flex-col gap-3"
            action="#"
            method="POST"
            onSubmit={(e) => e.preventDefault()}
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
              Entrar
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
