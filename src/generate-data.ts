import { faker } from '@faker-js/faker';

interface Room {
  id: number;
  name: string;
  capacity: number;
  amenities: string[];
}

interface Facility {
  id: number;
  name: string;
  type: string;
  available: boolean;
}

const generateRooms = () => {
  return Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    name: `Room ${faker.location.buildingNumber()}`,
    capacity: faker.number.int({ min: 2, max: 20 }),
    amenities: faker.helpers.arrayElements(['AC', 'Projector', 'Whiteboard', 'WiFi'], 2)
  }));
};

const generateFacilities = () => {
  return Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    name: faker.company.name(),
    type: faker.helpers.arrayElement(['Gym', 'Pool', 'Auditorium', 'Lab']),
    available: faker.datatype.boolean()
  }));
};

Bun.write('public/rooms.json', JSON.stringify(generateRooms()));
Bun.write('public/facilities.json', JSON.stringify(generateFacilities()));