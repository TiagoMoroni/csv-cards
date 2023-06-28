const { User } = require("../models");
const { Op } = require('sequelize');

function processCSVData(fileData) {
  const rows = Buffer.from(fileData, 'base64').toString('utf8').split('\n');
  const users = rows.map((row) => {
    const [name, city, country, favoriteSport] = row.split(',');
    if (name && city && country && favoriteSport) {
      return { name, city, country, favorite_sport: favoriteSport.replace('\r', '') };
    } else {
      throw new Error('One or more users have invalid data')
    }
  });
  return users;
}

class UserController {
  async store(req, res) {
    const base64Data = req.body.content;

    if (!base64Data) {
      return res.status(400).json({ error: 'No base64-encoded CSV file provided' });
    }

    let users = []
    try {
      users = processCSVData(base64Data);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    try {
      await User.destroy({ where: {} })
      await User.bulkCreate(users)
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async search(req, res) {
    const { q } = req.query;

    try {
      const users = await User.findAll({
        where: {
          name: {
            [Op.iLike]: `%${q}%`,
          },
        }
      });
      res.json(users);
    } catch (error) {
        res.status(400).json({ error: 'Invalid search query' });
    }
  }
}

module.exports = new UserController();
