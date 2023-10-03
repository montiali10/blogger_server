const prisma = require('../configs/db');

const getBlog = async (id) => {
    try {
        const blog = await prisma.blog.findFirst({ where: { id: id }});
        return blog;
    } catch (error) {
        throw new Error(error);
    }
}

const getBlogs = async () => {
    try {
        const blogs = await prisma.blog.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });
        return blogs;
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

const editBlog = async (blog) => {
    try {
        await prisma.blog.update({
            where: { id: blog.id },
            data: {
                title: blog.title,
                content: blog.content,
                summary: blog.summary
            }
        });
    } catch (error) {
        console.log(error);
        throw new Error('Something went wrong.');
    }
}

const deleteBlog = async (id) => {
    try {
        await prisma.blog.delete({ where: {
            id: id
        }});
        return;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}


module.exports = {
    getBlog,
    getBlogs,
    postBlog,
    editBlog,
    deleteBlog
};