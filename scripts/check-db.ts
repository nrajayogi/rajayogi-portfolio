import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const content = await prisma.content.findUnique({
        where: { id: 1 },
    });
    if (content) {
        console.log("Database Content ID 1 found.");
        console.log("Data length:", content.data.length);
        try {
            const parsed = JSON.parse(content.data);
            console.log("Keys available in data:", Object.keys(parsed).join(", "));
            if (parsed.hero) {
                console.log("Hero layout status:", parsed.hero.layout ? "Exists" : "MISSING");
            }
        } catch (e) {
            console.error("Failed to parse content.data as JSON");
        }
    } else {
        console.log("No content found in database for ID 1.");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
