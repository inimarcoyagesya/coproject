import { faker } from '@faker-js/faker';
import { writeFileSync } from 'fs';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const generateUsers = (count: number): User[] => {
  const users: User[] = [];
  for (let i = 1; i <= count; i++) {
    users.push({
      id: i,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: faker.helpers.arrayElement(['Admin', 'User', 'Editor']),
    });
  }
  return users;
};

const users = generateUsers(1000);
writeFileSync('./public/users.json', JSON.stringify(users, null, 2));

console.log('Data users berhasil di-generate dan disimpan di public/users.json');