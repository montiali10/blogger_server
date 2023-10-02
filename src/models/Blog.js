const prisma = require('../configs/db');

const getBlog = async (id) => {
    try {
        const blog = await prisma.blog.findFirst({ where: { id: id }});
        return blog;
    } catch (error) {
        throw new Error(error);
    }
}

const postBlog = async (values) => {
    try {
        await prisma.blog.create({
            data: {
                title: values.title,
                content: values.content,
                summary: values.summary,
                author: {
                    connect: {
                        id: values.autherId
                    }
                }
            }
        });
    } catch (error) {
        console.log(error);
        throw new Error('Something went wrong.');
    }
}


module.exports = {
    getBlog,
    postBlog
};