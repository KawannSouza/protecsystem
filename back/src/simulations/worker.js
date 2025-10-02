import prisma from "../../prisma/client.js";

export const startSimulation = () => {
  setInterval(async () => {
    const workers = await prisma.worker.findMany();

    for (const worker of workers) {
      const frequencia = Math.floor(Math.random() * (120 - 60 + 1)) + 60;
      const oxigenacao = Math.floor(Math.random() * (100 - 90 + 1)) + 90;
      const temperatura = parseFloat((Math.random() * (38 - 36) + 36).toFixed(1));
      const tempoTrabalho = worker.tempoTrabalho + 0.1;

      await prisma.worker.update({
        where: { id: worker.id },
        data: {
          frequencia,
          oxigenacao,
          temperatura,
          tempoTrabalho,
          historicoFrequencia: [...(worker.historicoFrequencia || []), frequencia],
        },
      });
    }
  }, 5000); // atualiza a cada 5s
};