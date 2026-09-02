import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
    const contentPath = path.join(process.cwd(), 'src', 'data', 'content.json')

    if (fs.existsSync(contentPath)) {
        const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'))
        console.log('Seeding initial content...')

        // Upsert ensuring ID 1 exists
        await prisma.content.upsert({
            where: { id: 1 },
            update: {}, // Don't overwrite if exists? Or should we? MVP: Don't overwrite if DB has data.
            create: {
                id: 1,
                data: content
            }
        })
        console.log('Content seeded successfully.')
    } else {
        console.log('No content.json found to seed.')
    }
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
