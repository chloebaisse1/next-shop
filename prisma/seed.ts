import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma/client"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Nettoyer les tables (ordre important : enfants d'abord)
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()

  // Insérer les produits
  await prisma.product.createMany({
    data: [
      {
        name: "Clavier Mécanique RGB",
        description: "Switches Cherry MX, rétroéclairage RGB",
        price: 89.99,
        stock: 25,
      },
      {
        name: "Souris Sans Fil",
        description: "Ergonomique, capteur 16000 DPI",
        price: 34.99,
        stock: 50,
      },
      {
        name: "Écran 27 pouces 4K",
        description: "Dalle IPS, 60Hz, idéal pour le dev",
        price: 349.99,
        stock: 10,
      },
      {
        name: "Casque Bluetooth",
        description: "Réduction de bruit active, 30h autonomie",
        price: 129.99,
        stock: 30,
      },
      {
        name: "Webcam HD 1080p",
        description: "Autofocus, micro intégré",
        price: 49.99,
        stock: 40,
      },
      {
        name: "Hub USB-C 7-en-1",
        description: "HDMI, USB 3.0, SD, Ethernet",
        price: 39.99,
        stock: 60,
      },
    ],
  })

  console.log("Seed terminé !")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
