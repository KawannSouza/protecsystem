"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { WorkerStatusCard } from "@/components/WorkerStatusCard";
import { Funnel, Heart, Orbit, Thermometer, X } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();

  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await fetch("https://protecsystem.onrender.com/workers");
        const data = await res.json();

        const normalized = data.map((worker: any) => ({
          id: worker.id,
          name: worker.nome || "Sem Nome",
          role: worker.setor || "Não definido",
          avatarSrc: worker.foto || "/avatar.png",
          avatarFallback: worker.nome ? worker.nome[0] : "?",
          metrics: [
            { value: worker.frequencia ?? 0, label: "Frequência", Icon: Heart, iconColor: "text-red-500" },
            { value: worker.oxigenacao ?? 0, label: "Oxigenação", Icon: Orbit, iconColor: "text-green-500" },
            { value: worker.temperatura ?? 0, label: "Temperatura", Icon: Thermometer, iconColor: "text-yellow-500" },
          ],
          status: worker.status || "Desconhecido",
        }));

        setWorkers(normalized);
      } catch (err) {
        console.error("Erro ao buscar trabalhadores:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  const handleCardClick = (id: string) => {
    router.push(`/dashboard/${id}`);
  };

  const workersByStatus = (status: string) => workers.filter(w => w.status === status);

  const handleModalClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).id === "modal-bg") {
      setFilterOpen(false);
    }
  };

  if (loading) {
    return <div className="text-white text-2xl p-10">Carregando...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4 sm:px-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full mb-6 gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-blue-500 text-transparent bg-clip-text">
          Plataforma de Monitoramento
        </h1>
        <Button
          variant="secondary"
          className="flex items-center gap-2 rounded-xl shadow-md transition-all hover:scale-105"
          onClick={() => setFilterOpen(true)}
        >
          <Funnel /> Filtros
        </Button>
      </div>

      {/* Contadores */}
      <div className="flex flex-wrap justify-between w-full gap-4 mt-4">
        <div className="flex flex-col">
          <h4 className="text-gray-300 text-lg sm:text-xl">Total Trabalhadores</h4>
          <h2 className="text-3xl sm:text-5xl font-semibold text-white">{workers.length}</h2>
        </div>
        <div className="flex flex-wrap gap-4">
          <div
            className="bg-red-500/20 w-28 sm:w-35 p-4 flex flex-col items-center justify-center rounded-2xl shadow cursor-pointer hover:scale-105 transition"
            onClick={() => setFilterOpen(true)}
          >
            <h2 className="font-semibold text-3xl sm:text-5xl text-red-500">{workersByStatus("Alerta").length}</h2>
            <h4 className="text-gray-300 text-sm sm:text-xl">Em Alerta</h4>
          </div>
          <div
            className="bg-yellow-500/20 w-28 sm:w-35 p-4 flex flex-col items-center justify-center rounded-2xl shadow cursor-pointer hover:scale-105 transition"
            onClick={() => setFilterOpen(true)}
          >
            <h2 className="font-semibold text-3xl sm:text-5xl text-yellow-500">{workersByStatus("Atenção").length}</h2>
            <h4 className="text-gray-300 text-sm sm:text-xl">Em Atenção</h4>
          </div>
          <div
            className="bg-green-500/20 w-28 sm:w-35 p-4 flex flex-col items-center justify-center rounded-2xl shadow cursor-pointer hover:scale-105 transition"
            onClick={() => setFilterOpen(true)}
          >
            <h2 className="font-semibold text-3xl sm:text-5xl text-green-500">{workersByStatus("Ok").length}</h2>
            <h4 className="text-gray-300 text-sm sm:text-xl">Ok</h4>
          </div>
        </div>
      </div>

      {/* Lista geral */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {workers.map((worker) => (
          <div
            key={worker.id}
            className="cursor-pointer transform transition-all hover:scale-105 hover:shadow-lg"
            onClick={() => handleCardClick(worker.id)}
          >
            <WorkerStatusCard {...worker} />
          </div>
        ))}
      </div>

      {/* Modal de Filtro */}
      {filterOpen && (
        <div
          id="modal-bg"
          onClick={handleModalClick}
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-start p-4 sm:p-10 z-50 overflow-y-auto"
        >
          <div className="bg-zinc-900 rounded-2xl p-4 sm:p-6 w-full sm:w-4/5 max-h-[90vh] overflow-y-auto shadow-xl animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Filtros por Status</h2>
              <Button variant="ghost" onClick={() => setFilterOpen(false)}>
                <X size={24} />
              </Button>
            </div>

            {["Alerta", "Atenção", "Ok"].map(status => (
              <div key={status} className="mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">{status}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workersByStatus(status).map(worker => (
                    <div
                      key={worker.id}
                      className="cursor-pointer transform transition hover:scale-105"
                      onClick={() => {
                        setFilterOpen(false);
                        handleCardClick(worker.id);
                      }}
                    >
                      <WorkerStatusCard {...worker} />
                    </div>
                  ))}
                  {workersByStatus(status).length === 0 && (
                    <p className="text-gray-400 col-span-3">Nenhum trabalhador nessa categoria.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}