import prisma from "../../prisma/client.js";

const WorkerService = {
  create: async (data) => {
    return prisma.worker.create({ data });
  },

  findAll: async () => {
    return prisma.worker.findMany();
  },

  findById: async (id) => {
    return prisma.worker.findUnique({ where: { id } });
  },

  update: async (id, data) => {
    return prisma.worker.update({ where: { id }, data });
  },
};

export default WorkerService;