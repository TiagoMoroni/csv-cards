const { User } = require("../models");
const { Op } = require('sequelize');

function processCSVData(fileData) {
  const rows = atob(fileData).split('\n');
  const users = rows.map((row) => {
    const [name, city, country, favoriteSport] = row.split(',');
    return { name, city, country, favorite_sport: favoriteSport.replace('\r', '') };
  });
  return users;
}

class UserController {
  async store(req, res) {
    const base64Data = req.body.content;
    
    if (!base64Data) {
      return res.status(400).json({ error: 'No base64-encoded CSV file provided' });
    }
    
    // Decode the base64 data
    const users = processCSVData(base64Data);
    console.log(users)
    try {
      await User.destroy({where: {}})      
      await User.bulkCreate(users)      
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error });
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
      res.status(500).json({ error });
    }
  }
}

module.exports = new UserController();
