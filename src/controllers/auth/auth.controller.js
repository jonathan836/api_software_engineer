import { pool } from '../../db.js'
import { generateJWT } from '../../helpers/generateJWT.js';
import bcryptjs from "bcryptjs";

export const auth = async (req, res) => {
  const { body } = req
  const email = body.email;
  const password = body.password;

  try {
    const [users] = await pool.query('SELECT * FROM t_user WHERE t_user.email = ?', [email])

    if (users.length === 0) {
      res.status(400).json({
        status: 'Error',
        data: 'Incorrect Email! Please try again'
      })
    } else {
      const validatePassword = await bcryptjs.compare(password, users.find(e => e.password).password)

      if (!validatePassword) {
        res.status(400).json({
          status: 'Error',
          data: 'Incorrect Password! Please try again'
        })
      } else {
        const token = await generateJWT(email, password)

        if (token.length === 0) {
          res.status(400).json({
            status: 'Error',
            data: 'Error token'
          })
        }

        res.send({
          status: 'SUCCESS',
          data: token
        })
      }
    }

  } catch (error) {
    res.status(500).json({
      status: 'Error',
      data: 'An error has occurred'
    })
  }
}