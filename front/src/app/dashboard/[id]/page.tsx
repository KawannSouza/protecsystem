"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Activity, Orbit, PersonStanding, Thermometer, AlertCircle, X } from "lucide-react";

// ✅ Define os tipos de métricas
interface Metric {
  value: number;
  label: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  iconColor: string;
}

// ✅ Define o tipo do Worker
interface Worker {
  id: number;
  name: string;
  role: string;
  avatarSrc: string;
  avatarFallback: string;
  status: string;
  supervisor: string;
  observacoes: string;
  metrics: Metric[];
}

export default function AvancedScreen() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();

  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const res = await fetch(`https://protecsystem.onrender.com/workers/${id}`);
        const data = await res.json();

        if (!data) {
          setWorker(null);
          return;
        }

        const metrics: Metric[] = [
          { value: data.frequencia ?? 0, label: "BPM", Icon: Activity, iconColor: "text-red-500" },
          { value: data.oxigenacao ?? 0, label: "Oxigenação", Icon: Orbit, iconColor: "text-green-500" },
          { value: data.temperatura ?? 0, label: "°C", Icon: Thermometer, iconColor: "text-yellow-500" },
        ];

        setWorker({
          id: data.id,
          name: data.nome || "Sem Nome",
          role: data.setor || "Não definido",
          avatarSrc: data.foto || "/avatar.png",
          avatarFallback: data.nome ? data.nome[0] : "?",
          status: data.status || "OK",
          supervisor: data.supervisor || "Não definido",
          observacoes: data.observacoes || "Nenhuma",
          metrics,
        });
      } catch (err) {
        console.error("Erro ao buscar trabalhador:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorker();
  }, [id]);

  const sendAlert = () => {
    setAlertVisible(true);
  };

  if (loading) {
    return <div className="text-white text-2xl p-10">Carregando...</div>;
  }

  if (!worker) {
    return <div className="text-white text-2xl p-10">Trabalhador não encontrado</div>;
  }

  return (
    <div className="flex flex-col gap-10 py-6 px-4 md:px-10 relative">
      
      {/* CAIXA DE ALERTA */}
      {alertVisible && (
        <div className="fixed top-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg flex items-center gap-4 z-50 animate-fadeIn">
          <AlertCircle size={24} />
          <span>⚠️ Alerta enviado ao trabalhador: <strong>{worker.name}</strong></span>
          <button
            onClick={() => setAlertVisible(false)}
            className="ml-auto text-white hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6">
        <div className="flex items-center gap-6">
          <img
            className="w-24 md:w-32 h-24 md:h-32 rounded-full border-4 border-indigo-500 shadow-lg animate-pulse object-cover"
            src={worker.avatarSrc}
            alt={worker.name}
          />
          <div>
            <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent">
              {worker.name}
            </h2>
            <p className="text-sm md:text-lg text-gray-300">{worker.role}</p>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-4 flex-wrap">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="px-8 py-10 rounded-xl font-semibold text-sm md:text-xl text-indigo-400 border-indigo-400 cursor-pointer"
          >
            Voltar
          </Button>

          <Button
            variant="destructive"
            onClick={sendAlert}
            className="px-8 py-10 rounded-xl font-semibold text-sm md:text-xl flex items-center gap-2"
          >
            <AlertCircle size={20} /> Enviar Alerta
          </Button>
        </div>
      </div>

      {/* Métricas + Localização */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        
        {/* Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
          {worker.metrics.map((metric, index) => (
            <Card
              key={index}
              className="bg-zinc-800 border-zinc-700 rounded-2xl shadow-lg hover:scale-105 transition"
            >
              <CardHeader className="flex flex-col items-center gap-2">
                <metric.Icon size={36} className={metric.iconColor} />
                <h4 className="text-3xl md:text-4xl font-bold text-white">{metric.value}</h4>
                <p className="text-sm md:text-lg text-gray-400">{metric.label}</p>
              </CardHeader>
            </Card>
          ))}

          <Card className="bg-zinc-800 border-zinc-700 rounded-2xl shadow-lg hover:scale-105 transition">
            <CardHeader className="flex flex-col items-center gap-2">
              <PersonStanding size={36} className="text-indigo-400" />
              <h4 className="text-2xl font-bold text-white">Em movimento</h4>
              <p className="text-sm md:text-lg text-gray-400">Atividade</p>
            </CardHeader>
          </Card>
        </div>

        {/* Informações laterais */}
        <div className="w-full lg:w-1/3 bg-zinc-800 rounded-2xl shadow-lg p-6 flex flex-col gap-4">
          <h4 className="text-sm text-gray-400 tracking-wide">LOCALIZAÇÃO / SETOR</h4>
          <p className="text-lg text-white">{worker.role}</p>
          <img
            src="/local.png"
            alt="Mapa da fábrica"
            className="w-full object-cover rounded-xl hover:scale-105 transition"
          />

          <hr className="border-zinc-600" />

          <h5 className="text-sm text-gray-400 tracking-wide">Supervisor Responsável</h5>
          <p className="text-lg text-white">{worker.supervisor}</p>

          <hr className="border-zinc-600" />

          <h5 className="text-sm text-gray-400 tracking-wide">Observações Médicas</h5>
          <p className="text-lg text-white">{worker.observacoes}</p>
        </div>
      </div>
    </div>
  );
}