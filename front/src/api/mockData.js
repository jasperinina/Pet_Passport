// Моковые данные для разработки без бекенда

export const mockPet = {
  id: 1,
  name: "Вася",
  breed: "Дворняга",
  weightKg: 4,
  birthDate: "2025-11-03",
  ownerId: 1,
  photos: [
    {
      id: 1,
      url: "/uploads/pets/1/photo.jpg",
      telegramFileId: null
    }
  ]
};

export const mockEvents = [
  {
    id: 1,
    type: "vaccine",
    title: "Вакцинация от туберкулеза",
    eventDate: "2026-09-21T13:00:00Z",
    reminderEnabled: true,
    medicine: "Вакцина БЦЖ",
    nextVaccinationDate: "2026-09-21T13:00:00Z",
    status: 2
  },
  {
    id: 2,
    type: "doctor-visit",
    title: "Плановый осмотр",
    eventDate: "2025-09-25T10:00:00Z",
    reminderEnabled: false,
    clinic: "Ветеринарная клиника",
    doctor: "Иванов И.И.",
    status: 1
  },
  {
    id: 3,
    type: "treatment",
    title: "Обработка от паразитов",
    eventDate: "2026-10-01T14:00:00Z",
    reminderEnabled: true,
    remedy: "Капли на холку",
    parasite: "Блохи и клещи",
    status: 2
  }
];
