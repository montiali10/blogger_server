const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


async function getUser(id) {
    try {
        return await prisma.user.findFirstOrThrow(id);
    } catch (error) {
        console.log("[USER]",error);
    }
}

async function registerUser(user) {
    try {
        return await prisma.user.create({
            data: {
                
            }
        });
    } catch (error) {
        console.log("[USER]",error);
    }
}


module.exports = [
    getUser,
    registerUser
];