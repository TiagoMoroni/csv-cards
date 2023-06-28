const { User } = require("../../src/app/models");
const truncate = require("../utils/truncate");
const factory = require("../factories");

describe("User", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should save user correctly", async () => {
    const mockUser = await factory.create("User")

    const user = await User.create({
      name: mockUser.name,
      city: mockUser.city,
      country: mockUser.country,
      favorite_sport: mockUser.favorite_sport,
    });
    expect(user.email).toBe(mockUser.email);
  });

  it("should not let NOT NULL column empty", async () => {
    const mockUser = await factory.create("User")

    let error = null;
    try {
      const user = await User.create({
        name: mockUser.name,
        city: mockUser.city,
        country: mockUser.country,
        // empty required column
        // favorite_sport: mockUser.favorite_sport,
      });
    } catch (err) {
      error = err;
    }
    expect(error).not.toEqual(null);
  });
});
