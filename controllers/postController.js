import { Mongoose } from "mongoose";
import PostModel from "../models/Post.js";

export const tagsGetAll = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((post) => post.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to find the tags",
    });
  }
};

export const postsGetAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();

    res.json(posts);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to find the articles",
    });
  }
};

export const postsGetOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      },
      (err, doc) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            message: "Failed to find the article",
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: "Failed to find the article",
          });
        }

        res.json(doc);
        console.log(doc);
      }
    ).populate("user");
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to find the article",
    });
  }
};

export const postsDeleteOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            message: "Failed to delete the article",
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: "Failed to find the article",
          });
        }

        res.json({
          success: true,
        });
      }
    );
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to find the article",
    });
  }
};

export const postsCreate = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(", "),
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to create an article",
    });
  }
};

export const postsUpdateOne = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags.split(", "),
        user: req.userId,
      }
    );

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to find the article",
    });
  }
};
