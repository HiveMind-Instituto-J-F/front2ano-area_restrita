export const barRegularData = [
  { name: "Jan", value: 45 },
  { name: "Fev", value: 60 },
  { name: "Mar", value: 70 },
  { name: "Abr", value: 40 },
  { name: "Mai", value: 35 },
  { name: "Jun", value: 55 },
  { name: "Jul", value: 65 },
  { name: "Ago", value: 77 }, 
  { name: "Set", value: 70 },
  { name: "Out", value: 60 },
  { name: "Nov", value: 50 },
  { name: "Dez", value: 75 },
];

export const barManutencaoData = [
  { name: "Jan", value: 55 },
  { name: "Fev", value: 10 },
  { name: "Mar", value: 20 },
  { name: "Abr", value: 40 },
  { name: "Mai", value: 55 },
  { name: "Jun", value: 15 },
  { name: "Jul", value: 25 },
  { name: "Ago", value: 37 }, 
  { name: "Set", value: 50 },
  { name: "Out", value: 10 },
  { name: "Nov", value: 20 },
  { name: "Dez", value: 35 },
]

const initialEvents = [
  {
    title: 'Parada no setor D - Id: 2234',
    start: '2025-09-24T09:00:00',
    end: '2025-09-24T10:00:00',
    className: 'event-parada',
  },
  {
    title: 'Parada no setor A - Id: 1120',
    start: '2025-09-24T09:00:00', 
    end: '2025-09-24T10:00:00',
    className: 'event-parada', 
  },
  {
    title: 'Manutenção no Setor B - Id: 1202',
    start: '2025-09-24T10:00:00', 
    end: '2025-09-24T11:00:00',
    className: 'event-manutencao',
  },
];
export default initialEvents

export const pieData = [
  { id: 0, name: "Manutenção", value: 65, color: "#2563eb" }, 
  { id: 1, name: "Parada", value: 35, color: "#94a3b8" }, 
];

export const collaboratorData = [
  { name: "Vitor Lipshutz", sector: "A", time: 22 },
  { name: "Cesar Culhane", sector: "B", time: 24 },
  { name: "Adam Stanton", sector: "D", time: 28 },
];

export const collaboratorMaintenceData = [
  { name: "Ronaldo Cabral", sector: "A", fixed_machine: 2222 },
  { name: "Paolino Xibiu", sector: "B", fixed_machine: 1313 },
  { name: "Stalin Galdez", sector: "D", fixed_machine: 2241 },
];

export const COLORS = ["#2563eb", "#94a3b8"];
