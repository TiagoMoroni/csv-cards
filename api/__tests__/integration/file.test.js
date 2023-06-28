const { User } = require("../../src/app/models");
const UserController = require("../../src/app/controllers/UserController");
const { Op } = require('sequelize');

describe("UserController", () => {
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("store", () => {
    test("should store users from CSV data and return status 200", async () => {
      const req = {
        body: {
          content: "bmFtZSxjaXR5LGNvdW50cnksZmF2b3JpdGVfc3BvcnQKSm9obiBEb2UsTmV3IFlvcmssVVNBLEJhc2tldGJhbGwKSmFuZSBTbWl0aCxMb25kb24sVUssRm9vdGJhbGwKTWlrZSBKb2huc29uLFBhcmlzLEZyYW5jZSxUZW5uaXMKS2FyZW4gTGVlLFRva3lvLEphcGFuLFN3aW1taW5nClRvbSBCcm93bixTeWRuZXksQXVzdHJhbGlhLFJ1bm5pbmcKRW1tYSBXaWxzb24sQmVybGluLEdlcm1hbnksQmFza2V0YmFsbA==",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        sendStatus: jest.fn(),
      };

      await UserController.store(req, res);

      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    test("should return status 500 if an error occurs during user creation", async () => {
      const req = {
        body: {
          content: "bmFtZSxjaXR5LGNvdW50cnksZmF2b3JpdGVfc3BvcnQKSm9obiBEb2UsTmV3IFlvcmssVVNBLEJhc2tldGJhbGwKSmFuZSBTbWl0aCxMb25kb24sVUssRm9vdGJhbGwKTWlrZSBKb2huc29uLFBhcmlzLEZyYW5jZSxUZW5uaXMKS2FyZW4gTGVlLFRva3lvLEphcGFuLFN3aW1taW5nClRvbSBCcm93bixTeWRuZXksQXVzdHJhbGlhLFJ1bm5pbmcKRW1tYSBXaWxzb24sQmVybGluLEdlcm1hbnksQmFza2V0YmFsbA",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.bulkCreate = jest.fn()

      User.bulkCreate.mockRejectedValueOnce(new Error("Database error"));

      await UserController.store(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });

    test("should return status 400 if no base64-encoded CSV file is provided", async () => {
      const req = {
        body: {
          content: null,
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UserController.store(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "No base64-encoded CSV file provided",
      });
    });

  });

  describe("search", () => {
    test("should search for users by name and return matching users", async () => {
      const req = {
        query: {
          q: "John",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      User.findAll = jest.fn()

      User.findAll.mockResolvedValueOnce([
        {
          name: "John",
          city: "New York",
          country: "USA",
          favorite_sport: "Basketball",
        },
      ]);

      await UserController.search(req, res);

      expect(User.findAll).toHaveBeenCalledWith({
        where: {
          name: {
            [Op.iLike]: "%John%",
          },
        },
      });
      expect(res.json).toHaveBeenCalledWith([
        {
          name: "John",
          city: "New York",
          country: "USA",
          favorite_sport: "Basketball",
        },
      ]);
    });

    test("should return status 400 if an error occurs during search", async () => {
      const req = {
        query: {
          q: "John",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      User.findAll.mockRejectedValueOnce(new Error("Database error"));

      await UserController.search(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid search query" });
    });
  });
});
