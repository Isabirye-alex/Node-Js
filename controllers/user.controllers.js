const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db.controller.js');

async function registerNewUser(req, res) {
  try {
    const { firstName, lastName, email, username, password } = req.body;
    const imageUrl = req.file?.path;

    if (!firstName || !lastName || !email || !username || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required except the image' });
    }

    const [user] = await db.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (user.length > 0) {
      return res.status(409).json({ success: false, message: 'Username or email already taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const status = 'active';
    const usertype = 'customer';

    const [result] = await db.query(
      `INSERT INTO users (firstName, lastName, email, username, password, imageUrl, status, usertype) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, email, username, hashedPassword, imageUrl, status, usertype]
    );

    return res.status(201).json({
      success: true,
      message: 'User account successfully created',
      user: {
        id: result.insertId,
        firstName,
        lastName,
        username,
        email,
        imageUrl,
        status,
        usertype
      }
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to register new user', error: error.message });
  }
}

//Track users location
async function getGeoLocation(ip) {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    return response.data; // includes country, region, city, lat, lon, etc.
  } catch (error) {
    return null;
  }
}


async function userLogin(req, res) {
  const { username, password } = req.body;
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',')[0].trim() : req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];

  const geo = await getGeoLocation(ip);
  console.log(geo);
  const country = geo?.country || null;
  const city = geo?.city || null;
  const geog = await getGeoLocation("102.209.109.74"); // Replace with a known IP
  console.log(geog);


  try {
    const [userRows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = userRows[0];

    // Hash the attempted password (for logging only, don't compare hashed → hashed)
    const hashedAttemptedPassword = await bcrypt.hash(password, 10);

    if (!user) {
      // Log failed login
      await db.query(
        `INSERT INTO login_logs 
         (user_id, login_username, login_password_hash, login_status, ip_address, user_agent, location_country, location_city)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [null, username, hashedAttemptedPassword, 'failed', ip, userAgent, country, city]
      );
      
      return res.status(400).json({ success: false, message: 'Invalid username' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Log failed login
      await db.query(
        `INSERT INTO login_logs 
         (user_id, login_username, login_password_hash, login_status, ip_address, user_agent, location_country, location_city)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [user.id, username, hashedAttemptedPassword, 'failed', ip, userAgent, country, city]
      );
      
      return res.status(400).json({ success: false, message: 'Invalid login credentials! Cross-check password and try again.' });
    }

    // Password matched — log success
    const loginStatus = 'success';

    await db.query(
      `INSERT INTO login_logs 
   (user_id, login_username, login_password_hash, login_status, ip_address, user_agent, location_country, location_city)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user?.id || null, username, hashedAttemptedPassword, loginStatus, ip, userAgent, country, city]
    );

    const token = jwt.sign({ id: user.id }, process.env.SECRET_ACCESS_TOKEN, { expiresIn: '1d' });
    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      }
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Login failed. Try again later.', error: error.message });
  }
}

async function getUsers(req, res) {
  try {
    const [users] = await db.query('SELECT * FROM users');
    if (users.length === 0) {
      res.status(404).json({ success: false, message: 'No users found' })
    }
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users', error: error.message });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, username, password, imageUrl } = req.body;

    // Check if user exists
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User data not found' });
    }

    // Check if new username or email is used by another user
    const [conflicts] = await db.query(
      'SELECT * FROM users WHERE (username = ? OR email = ?) AND id != ?',
      [username, email, id]
    );
    if (conflicts.length > 0) {
      return res.status(409).json({ success: false, message: 'Username or email already in use by another user' });
    }

    // Hash the new password if provided, otherwise use existing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = password ? await bcrypt.hash(password, salt) : rows[0].password;

    // Perform the update
    await db.query(`
      UPDATE users
      SET firstName = ?, lastName = ?, email = ?, username = ?, password = ?, imageUrl = ?
      WHERE id = ?
    `, [firstName, lastName, email, username, hashedPassword, imageUrl, id]);

    res.status(200).json({ success: true, message: 'User data updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not update user', error: error.message });
  }
}


async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, username, password, imageUrl } = req.body;
    const [userRows] = await db.query('SELECT * FROM users where id = ?', [id]);
    const user = userRows[0];
    if (user.length === 0) {
      res.status(404).json({ success: false, message: 'User data not found' });
    }

    await db.query(`
        DELETE FROM users WHERE id = ?
      `, [id]);
    res.status(201).json({ success: true, message: 'User successfully deleted' });
  } catch (error) {
    res.status(500).json({ succes: false, message: 'Could not deleted user', error: error.message });
  }
}

async function fetchUserByUserId(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}


module.exports = {
  registerNewUser,
  userLogin,
  updateUser,
  deleteUser,
  getUsers,
  fetchUserByUserId
};
