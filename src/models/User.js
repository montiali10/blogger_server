const prisma = require('../configs/db');

const getUser = async (id) => {
    try {
        const user = await prisma.user.findFirst(id);
        return user;
    } catch (error) {
        return null;
        console.log("[USER]",error);
    }
}

module.exports = {
    getUser
};