import Logo from "@/components/ui/logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center">
        <div className="mb-8">
          <Logo />
          <h1 className="text-3xl font-bold text-white mb-4">404</h1>
        </div>

        {/* Message */}
        <h2 className="text-2xl font-semibold text-white mb-3">Página não encontrada</h2>
        <p className="text-gray-400 mb-8">A página que você procura não existe ou foi removida.</p>

        <a
          href="/"
          className="inline-block px-8 py-3 bg-c12 text-white font-medium rounded hover:bg-c10 transition-colors"
        >
          Voltar para o início
        </a>
      </div>
    </div>
  );
}
