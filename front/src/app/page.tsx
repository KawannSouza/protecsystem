"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 text-white p-6">
      
      {/* Título */}
      <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fadeIn">
        Created by PROTEC
      </h1>

      {/* Mensagem */}
      <p className="text-lg md:text-xl text-gray-300 mb-8 text-center max-w-lg animate-fadeIn delay-200">
        Bem-vindo à plataforma de monitoramento. Explore os dados dos trabalhadores e garanta segurança e eficiência.
      </p>

      {/* Botão */}
      <Button
        variant="outline"
        className="px-10 py-6 cursor-pointer text-indigo-500 text-lg font-bold rounded-full border-white border-2 hover:bg-white hover:text-indigo-900 transition-all animate-fadeIn delay-200"
        onClick={() => router.push("/dashboard")}
      >
        Ir para Dashboard
      </Button>

      {/* Rodapé */}
      <footer className="absolute bottom-4 text-sm text-gray-400 animate-fadeIn delay-600">
        © {new Date().getFullYear()} PROTEC. Todos os direitos reservados.
      </footer>
    </div>
  );
}
