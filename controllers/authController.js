const express = require('express')
const auth = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const { createNewUser, findUserByUID } = require('../queries/users.js')
const { createUserStats  } = require('../queries/stats.js')

auth.post('/register', async (req, res) => {
  try {
    const newUser = await createNewUser(req.body);
    
    if (!newUser) {
      return res.status(500).json({ error: 'Error creating user' });
    }
    const newUserStats = await createUserStats(newUser.id);
    res.status(201).json({
      user: newUser,
      stats: newUserStats
    });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});


auth.get('/user/:uid', authMiddleware, async (req, res) => {
  const { uid } = req.params

  const user = await findUserByUID(uid)

  if (user) {
    res.status(200).json(user)
  } else {
    res.status(500).json({ error: 'Error fetching user' })
  }
})

module.exports = auth
