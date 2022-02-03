const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
//const cool = require('cool-ascii-faces')
const express = require('express')
const path = require('path');
const res = require('express/lib/response');
const { render } = require('express/lib/response');
const PORT = process.env.PORT || 5000

express()
  .disable('x-powered-by')
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/robots.txt', (req, res) => res.render('pages/arretecbon'))
  .get('/wp-login.php', (req, res) => res.render('pages/arretecbon'))
  //.get('/', (req, res) => res.render('pages/index'))
  //.get('/cool', (req, res) => res.send(cool()))
  //.get('/times', (req, res) => res.send(showTimes()))
  .get('/', async (req, res) => {
    try{
      const client = await pool.connect();
      const result = await client.query('select * from scoreboard order by score desc');
      const results = {'results': (result) ? result.rows : null};
      res.render('pages/index', results);
      client.release();
    } catch(err) {
      console.error(err);
      res.send("Error "+err);
    }
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))