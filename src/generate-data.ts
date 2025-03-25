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

interface BookingRoom {
  id: number;
  roomNumber: string;
  date: string;
  bookedBy: string;
  status: string;
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

const generateBookings = () => {
  return Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    roomNumber: `Room ${faker.location.buildingNumber()}`,
    date: faker.date.future().toISOString().split('T')[0],
    bookedBy: faker.person.fullName(),
    status: faker.helpers.arrayElement(['Pending', 'Confirmed', 'Cancelled'])
  }));
};

Bun.write('public/rooms.json', JSON.stringify(generateRooms()));
Bun.write('public/facilities.json', JSON.stringify(generateFacilities()));
Bun.write('public/bookingRooms.json', JSON.stringify(generateBookings()));
