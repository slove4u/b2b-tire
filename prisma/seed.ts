import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { loginId: 'admin' },
    update: {},
    create: {
      loginId: 'admin',
      password: 'password123', // In a real app, hash this with bcrypt
      name: '시스템 관리자',
      role: 'ADMIN',
      phone: '010-0000-0000',
    },
  })
  console.log(`Created admin user with id: ${admin.id}`)

  // Create Client
  const client1 = await prisma.user.upsert({
    where: { loginId: 'client1' },
    update: {},
    create: {
      loginId: 'client1',
      password: 'password123', // In a real app, hash this with bcrypt
      name: '대박 타이어',
      role: 'CLIENT',
      tier: 'VIP',
      phone: '010-1234-5678',
    },
  })
  console.log(`Created client user with id: ${client1.id}`)

  // Sample Products for 225/55R17 Smart Search test
  const products = [
    {
      spec: '225/55R17',
      normalized_spec: '2255517',
      brand: 'Hankook',
      pattern: 'Kinergy EX',
      price: 105000,
      stock: 50,
      imageUrl: 'https://via.placeholder.com/150?text=Hankook',
    },
    {
      spec: '225/55R17',
      normalized_spec: '2255517',
      brand: 'Kumho',
      pattern: 'Majesty9',
      price: 110000,
      stock: 30,
      imageUrl: 'https://via.placeholder.com/150?text=Kumho',
    },
    {
      spec: '245/45R18',
      normalized_spec: '2454518',
      brand: 'Michelin',
      pattern: 'Primacy 4',
      price: 220000,
      stock: 15,
      imageUrl: 'https://via.placeholder.com/150?text=Michelin',
    },
    {
      spec: '205/60R16',
      normalized_spec: '2056016',
      brand: 'Nexen',
      pattern: 'Nfera AU5',
      price: 85000,
      stock: 100,
      imageUrl: 'https://via.placeholder.com/150?text=Nexen',
    }
  ]

  for (const p of products) {
    const product = await prisma.product.create({
      data: p,
    })
    console.log(`Created product with id: ${product.id}`)
  }

  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
