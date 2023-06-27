const { User } = require("../../src/app/models");
const UserController = require("../../src/app/controllers/UserController");

jest.mock("../../src/app/models", () => {
  const SequelizeMock = require("sequelize-mock");
  const dbMock = new SequelizeMock();
  return {
    User: dbMock.define("User", {
      name: "John",
      city: "New York",
      country: "USA",
      favorite_sport: "Basketball",
    }),
  };
});

describe("UserController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("store", () => {
    test("should store users from CSV data and return status 200", async () => {
      const req = {
        body: {
          content: "base64-encoded CSV data",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        sendStatus: jest.fn(),
      };

      await UserController.store(req, res);

      expect(User.destroy).toHaveBeenCalled();
      expect(User.bulkCreate).toHaveBeenCalled();
      expect(res.sendStatus).toHaveBeenCalledWith(200);
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

    test("should return status 500 if an error occurs during user creation", async () => {
      const req = {
        body: {
          content: "base64-encoded CSV data",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      User.bulkCreate.mockRejectedValueOnce(new Error("Database error"));

      await UserController.store(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: expect.any(Error) });
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
            [User.Op.iLike]: "%John%",
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

    test("should return status 500 if an error occurs during search", async () => {
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

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: expect.any(Error) });
    });
  });
});
