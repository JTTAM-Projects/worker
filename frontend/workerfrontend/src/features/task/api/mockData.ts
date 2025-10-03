import type { Task, PaginatedResponse } from '../types';

// Mock users matching backend UserDto
const mockUsers = {
  user1: {
    userName: "matti.meikalainen",
    mail: "matti@example.com",
    businessId: "1234567-8",
    phoneNumber: "+358401234567",
    address: "Testikatu 1, 00100 Helsinki"
  },
  user2: {
    userName: "liisa.virta",
    mail: "liisa@example.com",
    businessId: "",
    phoneNumber: "+358501234567",
    address: "Esimerkkitie 5, 00200 Espoo"
  },
  user3: {
    userName: "jukka.joki",
    mail: "jukka@example.com",
    businessId: "9876543-2",
    phoneNumber: "+358451234567",
    address: "Testitie 10, 01300 Vantaa"
  }
};

// Mock tasks matching backend TaskDto
export const mockTasks: Task[] = [
  {
    id: 1,
    user: mockUsers.user1,
    category: "CLEANING",
    title: "Keittiön perusteellinen siivous",
    price: 45,
    startDate: new Date(2025, 9, 15, 10, 0).toISOString(),
    endDate: new Date(2025, 9, 15, 14, 0).toISOString(),
    location: "Helsinki, Kallio",
    status: "ACTIVE",
    description: "Tarvitsen apua keittiön perusteelliseen siivoukseen. Sisältää kaappien sisäpuolien pesun ja uunin puhdistuksen."
  },
  {
    id: 2,
    user: mockUsers.user2,
    category: "GARDEN",
    title: "Pihan haravointi ja lehtien keruu",
    price: 35,
    startDate: new Date(2025, 9, 16, 9, 0).toISOString(),
    endDate: new Date(2025, 9, 16, 12, 0).toISOString(),
    location: "Espoo, Leppävaara",
    status: "ACTIVE",
    description: "Iso piha jossa paljon lehtiä. Haravat ja säkit löytyvät."
  },
  {
    id: 3,
    user: mockUsers.user3,
    category: "MOVING",
    title: "Muuttolaatikoiden kantoapu",
    price: 60,
    startDate: new Date(2025, 9, 18, 14, 0).toISOString(),
    endDate: new Date(2025, 9, 18, 17, 0).toISOString(),
    location: "Vantaa, Tikkurila",
    status: "ACTIVE",
    description: "Tarvitsen apua noin 20 muuttolaatikon kantamiseen 3. kerroksesta pois. Hissi löytyy."
  },
  {
    id: 4,
    user: mockUsers.user1,
    category: "CLEANING",
    title: "Ikkunoiden pesu",
    price: 40,
    startDate: new Date(2025, 9, 20, 10, 0).toISOString(),
    endDate: new Date(2025, 9, 20, 13, 0).toISOString(),
    location: "Helsinki, Kamppi",
    status: "ACTIVE",
    description: "Kaksi isoa ikkunaa tarvitsee pesun ulko- ja sisäpuolelta. Sijainti 2. kerros."
  },
  {
    id: 5,
    user: mockUsers.user2,
    category: "OTHER",
    title: "Huonekalujen kokoaminen",
    price: 50,
    startDate: new Date(2025, 9, 22, 15, 0).toISOString(),
    endDate: new Date(2025, 9, 22, 18, 0).toISOString(),
    location: "Espoo, Tapiola",
    status: "ACTIVE",
    description: "IKEA kaappi ja hylly tarvitsevat kokoamisen. Kaikki osat ja työkalut löytyvät."
  },
  {
    id: 6,
    user: mockUsers.user3,
    category: "GARDEN",
    title: "Pensaiden leikkaus",
    price: 55,
    startDate: new Date(2025, 9, 25, 11, 0).toISOString(),
    endDate: new Date(2025, 9, 25, 15, 0).toISOString(),
    location: "Vantaa, Myyrmäki",
    status: "ACTIVE",
    description: "Pihalla 5 pensasta jotka kaipaavat muotoilua ja leikkausta syksyä varten."
  },
  {
    id: 7,
    user: mockUsers.user1,
    category: "CLEANING",
    title: "Auton sisäpuhdistus",
    price: 70,
    startDate: new Date(2025, 9, 26, 13, 0).toISOString(),
    endDate: new Date(2025, 9, 26, 16, 0).toISOString(),
    location: "Helsinki, Vuosaari",
    status: "ACTIVE",
    description: "Perheen auto kaipaa perusteellista sisäpuhdistusta. Imurointi ja pintojen puhdistus."
  },
  {
    id: 8,
    user: mockUsers.user2,
    category: "MOVING",
    title: "Vanhan sohvan kuljetus kierrätykseen",
    price: 40,
    startDate: new Date(2025, 9, 28, 10, 0).toISOString(),
    endDate: new Date(2025, 9, 28, 12, 0).toISOString(),
    location: "Espoo, Matinkylä",
    status: "ACTIVE",
    description: "Kolmen istuttava sohva pitää viedä lähimpään kierrätyspisteeseen. Auto tarvitaan."
  },
  {
    id: 9,
    user: mockUsers.user3,
    category: "OTHER",
    title: "Sähköpyörän huolto",
    price: 45,
    startDate: new Date(2025, 10, 1, 14, 0).toISOString(),
    endDate: new Date(2025, 10, 1, 16, 0).toISOString(),
    location: "Vantaa, Tikkurila",
    status: "ACTIVE",
    description: "Sähköpyörä kaipaa perushuoltoa ja vaihteiden säätöä."
  },
  {
    id: 10,
    user: mockUsers.user1,
    category: "CLEANING",
    title: "Parvekkeen puhdistus",
    price: 30,
    startDate: new Date(2025, 10, 3, 11, 0).toISOString(),
    endDate: new Date(2025, 10, 3, 13, 0).toISOString(),
    location: "Helsinki, Kallio",
    status: "ACTIVE",
    description: "Iso parveke jossa paljon likaa ja kasveja. Tarvitsee painepesun."
  },
  {
    id: 11,
    user: mockUsers.user2,
    category: "GARDEN",
    title: "Nurmikon leikkuu",
    price: 40,
    startDate: new Date(2025, 10, 5, 10, 0).toISOString(),
    endDate: new Date(2025, 10, 5, 12, 0).toISOString(),
    location: "Espoo, Leppävaara",
    status: "ACTIVE",
    description: "Keskikokoinen nurmikko tarvitsee viimeisen leikkuun ennen talvea. Ruohonleikkuri löytyy."
  },
  {
    id: 12,
    user: mockUsers.user3,
    category: "OTHER",
    title: "Tietokoneen asennus ja käyttöönotto",
    price: 55,
    startDate: new Date(2025, 10, 7, 15, 0).toISOString(),
    endDate: new Date(2025, 10, 7, 17, 0).toISOString(),
    location: "Vantaa, Myyrmäki",
    status: "ACTIVE",
    description: "Uusi PC tarvitsee asennuksen ja ohjelmien käyttöönoton. Windows ja perussovellukset."
  }
];

// Helper function to create paginated mock response
export function createMockPaginatedResponse(
  page: number = 0,
  size: number = 10,
  category?: string
): PaginatedResponse<Task> {
  // Filter by category if provided
  let filteredTasks = mockTasks;
  if (category) {
    filteredTasks = mockTasks.filter(task => task.category === category);
  }

  const totalElements = filteredTasks.length;
  const totalPages = Math.ceil(totalElements / size);
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const content = filteredTasks.slice(startIndex, endIndex);

  return {
    content,
    pageable: {
      pageNumber: page,
      pageSize: size,
      sort: {
        empty: true,
        sorted: false,
        unsorted: true
      },
      offset: startIndex,
      paged: true,
      unpaged: false
    },
    totalPages,
    totalElements,
    last: page >= totalPages - 1,
    size,
    number: page,
    sort: {
      empty: true,
      sorted: false,
      unsorted: true
    },
    numberOfElements: content.length,
    first: page === 0,
    empty: content.length === 0
  };
}
