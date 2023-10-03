const router = require("express").Router();
const prisma = require("../../configs/db");
const { postBlog, getBlog, editBlog, deleteBlog } = require("../../models/Blog");
const { validate } = require("../../validation/validate");
const {
  createBlogValidationRules,
} = require("../../validation/blogs/create_blog_validation");
const {
  updateBlogValidationRules,
} = require("../../validation/blogs/update_blog_validation");

router.get("/feed", async (req, res) => {
  const query = req.query;
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 4;
  const last_page = req.query.last_page;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const result = {};
  const totalCount = await prisma.blog.count();
  const totalPage = Math.ceil(totalCount / limit);
  const currentPage = page || 0;
  try {
    if (page < 0) {
      return res.status(400).json("Page value should not be negative");
    } else if (page === 1 && !last_page) {
      result.totalCount = totalCount;
      result.totalPage = totalPage;
      result.currentPage = currentPage;
      result.next = {
        page: page + 1,
        limit: limit,
      };
      result.paginateData = await prisma.blog.findMany({
        take: limit,
        skip: startIndex,
        orderBy: {
          id: "desc",
        },
      });
      res.paginatedResult = result;
      result.currentCountPerPage = Object.keys(result.paginateData).length;
      result.range = currentPage * limit;
      return res.status(200).json(result);
    } else if (endIndex < totalCount && !last_page) {
      result.totalCount = totalCount;
      result.totalPage = totalPage;
      result.currentPage = currentPage;
      result.next = {
        page: page + 1,
        limit: limit,
      };
      result.paginateData = await prisma.blog.findMany({
        take: limit,
        skip: startIndex,
        orderBy: {
          id: "desc",
        },
      });
      res.paginatedResult = result;
      result.currentCountPerPage = Object.keys(result.paginateData).length;
      result.range = currentPage * limit;
      return res.status(200).json(result);
    } else if (startIndex > 0 && !last_page) {
      result.totalCount = totalCount;
      result.totalPage = totalPage;
      result.currentPage = currentPage;
      result.previous = {
        page: page - 1,
        limit: limit,
      };
      result.paginateData = await prisma.blog.findMany({
        take: limit,
        skip: startIndex,
        orderBy: {
          id: "desc",
        },
      });
      res.paginatedResult = result;
      result.currentCountPerPage = Object.keys(result.paginateData).length;
      result.range = currentPage * limit;
      return res.status(200).json(result);
    } else if (last_page === "true" && page === totalPage) {
      result.totalCount = totalCount;
      result.totalPage = totalPage;
      result.currentPage = totalPage;
      result.last = {
        page: totalPage,
        limit: limit,
      };
      result.paginateData = await prisma.blog.findMany({
        take: limit,
        skip: startIndex,
        orderBy: {
          id: "desc",
        },
      });
      res.paginatedResult = result;
      result.currentCountPerPage = Object.keys(result.paginateData).length;
      result.range = totalCount;
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ error: "Resource not found" });
    }
  } catch (err) {
    console.error("error", err);
    return res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const blog = await getBlog(id);
    if (!blog) {
      res.status(404);
      return res.json({ message: "No blog with this ID." });
    }
    res.status(200);
    res.json(blog);
  } catch (error) {
    console.log(error);
    res.status(400);
    return res.json({ message: "Something went wrong" });
  }
});

router.post(
  "/create",
  createBlogValidationRules(),
  validate,
  async (req, res) => {
    const values = req.body;
    try {
      await postBlog({
        title: values.title,
        content: values.content,
        summary: values.summary,
        autherId: parseInt(values.autherId),
      });
      return res.sendStatus(201);
    } catch (error) {
      console.log(error);
      res.status(400);
      return res.json({ message: "Something went wrong." });
    }
  }
);

router.put("/:id",
    updateBlogValidationRules(),
    validate,
    async (req, res) => {
    const values = req.body;
    const id = parseInt(req.params.id);
    try {
        await editBlog({ 
            id: id, 
            title: values.title,
            content: values.content,
            summary: values.summary
        }); 
        return res.status(200).json({message: "updated"});
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "something went wrong." });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await deleteBlog(id);
        return res.status(204).json({ message: "blog deleted successfully!"});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "something went wrong!"});
    }
});

module.exports = router;
