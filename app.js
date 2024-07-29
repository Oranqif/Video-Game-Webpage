const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const connection = mysql.createConnection({
    host: 'sql.freedb.tech',
    user: 'freedb_oranqif',
    password: '&8zhbsMrVe73JrS',
    database: 'freedb_oranqif_database',
    port: 3000
});

const upload = multer({storage: storage});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public',express.static('public'));
app.use(express.static('public'));

app.get('/', (req,res) => {
    res.render('home');
});

app.get('/games', (req, res) => {
    const sql = 'SELECT * FROM games';
    connection.query(sql,(error,results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving students');
        }
        res.render('games',{games: results});
    });
});

app.get('/games/view', (req, res) => {
    const sql = 'SELECT * FROM games';
    connection.query(sql,(error,results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving students');
        }
        res.render('viewgames',{games: results});
    });
});

app.get('/game/purchase/:id', (req,res) => {
    const gameID = req.params.id;
    const sql = 'SELECT * FROM games WHERE gameID = ?';
    connection.query(sql,[gameID],(error,results) => {
        if(error) {
            console.error("Database query error:",error.message);
            return res.status(500).send('Error retrieving game by ID');
        }
        if (results.length > 0) {
            res.render('gamespurchase', {game: results[0]});
        } else {
            res.status(404).send('Game not found');
        }
    });
});

app.get('/game/view/:id', (req,res) => {
    const gameID = req.params.id;
    const sql = 'SELECT * FROM games WHERE gameID = ?';
    connection.query(sql,[gameID],(error,results) => {
        if(error) {
            console.error("Database query error:",error.message);
            return res.status(500).send('Error retrieving game by ID');
        }
        if (results.length > 0) {
            res.render('onegame', {game: results[0]});
        } else {
            res.status(404).send('Game not found');
        }
    });
});

app.get('/game/add',(req,res) => {
    res.render('addgame');
});

app.post('/game/add', upload.single('image'), (req,res) => {
    const {imagedesc, title, genre, content_rating, description, studio, price, date_released, quantity} = req.body;
    let image;
    if (req.file) {
        image = req.file.filename;
    } else {
        image = null;
    }
    const sql = 'INSERT INTO games (image, image_desc, title, genre, content_rating, description, studio, price, date_released, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, [image, imagedesc, title, genre, content_rating, description, studio, price, date_released, quantity], (error, results) => {
        if (error) {
            console.error('Error adding game:', error);
            res.status(500).send("Error adding game");
        } else {
            res.redirect('/games/view')
        }
    });
});

app.get('/game/delete/:id',(req,res) => {
    const gameID = req.params.id;
    const sql = 'DELETE FROM games WHERE gameID = ?';
    connection.query(sql, [gameID], (error, results) => {
        if (error) {
            console.error("Error deleting game:", error);
            res.status(500).send('Error deelting game');
        } else {
            res.redirect('/games/view')
        }
    });
});

app.get('/game/edit/:id', (req,res) => {
    const gameID = req.params.id;
    const sql = 'SELECT * FROM games WHERE gameID = ?';
    connection.query(sql, [gameID], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving game by ID');
        }
        if (results.length > 0) {
            res.render('editgame', {game: results[0]});
        } else {
            res.status(404).send('Game not found');
        }
    });
});

app.post('/game/edit/:id', upload.single('image'), (req, res) => {
    const gameID = req.params.id;
    let image = req.body.currentImage;
    if (req.file) {
        image = req.file.filename;
    }
    const {imagedesc,title, genre, content_rating, description, studio, price, date_released, quantity} = req.body;
    const sql = 'UPDATE games SET image = ?, image_desc = ?, title = ?, genre = ?, content_rating = ?, description = ?, studio = ?, price = ?, date_released = ?, quantity = ? WHERE gameID = ?';
    connection.query(sql, [image, imagedesc, title, genre, content_rating, description, studio, price, date_released, quantity, gameID], (error, results) => {
        if (error) {
            console.error("Error updating game:", error);
            res.status(500).send('Error updating game');
        } else {
            res.redirect('/games/view')
        }
    });
});

app.get('/consoles', (req, res) => {
    const sql = 'SELECT * FROM controllers';
    connection.query(sql,(error,results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving consoles');
        }
        res.render('controllers',{controllers: results});
    });
});

app.get('/console/purchase/:id', (req,res) => {
    const consoleID = req.params.id;
    const sql = 'SELECT * FROM controllers WHERE consoleID = ?';
    connection.query(sql,[consoleID],(error,results) => {
        if(error) {
            console.error("Database query error:", error.message);
            return res.status(500).send('Error retrieving console by ID');
        }
        if (results.length > 0) {
            res.render('controllerspurchase', {controller: results[0]});
        } else {
            res.status(404).send('Console not found');
        }
    });
});

app.get('/consoles/view', (req, res) => {
    const sql = 'SELECT * FROM controllers';
    connection.query(sql,(error,results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving consoles');
        }
        res.render('viewcontrollers',{controllers: results});
    });
});

app.get('/console/view/:id', (req,res) => {
    const consoleID = req.params.id;
    const sql = 'SELECT * FROM controllers WHERE consoleID = ?';
    connection.query(sql,[consoleID],(error,results) => {
        if(error) {
            console.error("Database query error:", error.message);
            return res.status(500).send('Error retrieving console by ID');
        }
        if (results.length > 0) {
            res.render('onecontroller', {controller: results[0]});
        } else {
            res.status(404).send('Console not found');
        }
    });
});

app.get('/console/add',(req,res) => {
    res.render('addcontroller');
});

app.post('/console/add', upload.single('image'), (req,res) => {
    const {imagedesc, name, type, description, company, price, date, quantity} = req.body;
    let image;
    if (req.file) {
        image = req.file.filename;
    } else {
        image = null;
    }
    const sql = 'INSERT INTO controllers (image, image_desc, name, type, company, price, date, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, [image, imagedesc, name, type, description, company, price, date, quantity], (error, results) => {
        if (error) {
            console.error('Error adding controller:', error);
            res.status(500).send("Error adding controller");
        } else {
            res.redirect('/consoles/view')
        }
    });
});

app.get('/console/edit/:id', (req,res) => {
    const consoleID = req.params.id;
    const sql = 'SELECT * FROM controllers WHERE consoleID = ?';
    connection.query(sql, [consoleID], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving console by ID');
        }
        if (results.length > 0) {
            res.render('editcontroller', {controller: results[0]});
        } else {
            res.status(404).send('Console not found');
        }
    });
});

app.post('/console/edit/:id', upload.single('image'), (req, res) => {
    const consoleID = req.params.id;
    let image;
    if (req.file) {
        image = req.file.filename;
    } else {
        image = null;
    }
    const {imagedesc, name, type, description, company, price, date, quantity} = req.body;
    const sql = 'UPDATE controllers SET image = ?, image_desc = ?, name = ?, type = ?, description = ?, company = ?, price = ?, date = ?, quantity = ? WHERE consoleID = ?';
    connection.query(sql, [image, imagedesc, name, type, description, company, price, date, quantity, consoleID], (error, results) => {
        if (error) {
            console.error("Error updating console:", error);
            res.status(500).send('Error updating console');
        } else {
            res.redirect('/consoles/view')
        }
    });
});

app.get('/figurines', (req, res) => {
    const sql = 'SELECT * FROM figurines';
    connection.query(sql,(error,results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving figurines');
        }
        res.render('figurines',{figurines: results});
    });
});

app.get('/figurine/purchase/:id', (req,res) => {
    const figurineID = req.params.id;
    const sql = 'SELECT * FROM figurines WHERE figurineID = ?';
    connection.query(sql,[figurineID],(error,results) => {
        if(error) {
            console.error("Database query error:",error.message);
            return res.status(500).send('Error retrieving figurine by ID');
        }
        if (results.length > 0) {
            res.render('figurinespurchase', {figurine: results[0]});
        } else {
            res.status(404).send('Figurine not found');
        }
    });
});

app.get('/figurines/view', (req, res) => {
    const sql = 'SELECT * FROM figurines';
    connection.query(sql,(error,results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving consoles');
        }
        res.render('viewfigurines',{figurines: results});
    });
});

app.get('/figurine/view/:id', (req,res) => {
    const figurineID = req.params.id;
    const sql = 'SELECT * FROM figurines WHERE figurineID = ?';
    connection.query(sql,[figurineID],(error,results) => {
        if(error) {
            console.error("Database query error:",error.message);
            return res.status(500).send('Error retrieving figurine by ID');
        }
        if (results.length > 0) {
            res.render('onefigurine', {figurine: results[0]});
        } else {
            res.status(404).send('Figurine not found');
        }
    });
});

app.get('/figurine/:id', (req,res) => {
    const figurineID = req.params.id;
    const sql = 'SELECT * FROM figurines WHERE figurineID = ?';
    connection.query(sql,[figurineID],(error,results) => {
        if(error) {
            console.error("Database query error:",error.message);
            return res.status(500).send('Error retrieving figurine by ID');
        }
        if (results.length > 0) {
            res.render('figurinespurchase', {figurine: results[0]});
        } else {
            res.status(404).send('Figurine not found');
        }
    });
});

app.get('/figurine/add',(req,res) => {
    res.render('addfigurine');
});

app.post('/figurine/add', upload.single('image'), (req,res) => {
    const {imagedesc, name, type, description, company, price, date, quantity} = req.body;
    let image;
    if (req.file) {
        image = req.file.filename;
    } else {
        image = null;
    }
    const sql = 'INSERT INTO controllers (image, image_desc, name, type, company, price, date, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, [image, imagedesc, name, type, description, company, price, date, quantity], (error, results) => {
        if (error) {
            console.error('Error adding figurine:', error);
            res.status(500).send("Error adding figurine");
        } else {
            res.redirect('/figurines/view')
        }
    });
});

app.get('/figurine/edit/:id', (req,res) => {
    const figurineID = req.params.id;
    const sql = 'SELECT * FROM figurines WHERE figurineID = ?';
    connection.query(sql, [figurineID], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving figurine by ID');
        }
        if (results.length > 0) {
            res.render('editfigurine', {figurine: results[0]});
        } else {
            res.status(404).send('Figurine not found');
        }
    });
});

app.post('/figurine/edit/:id', upload.single('image'), (req, res) => {
    const figurineID = req.params.id;
    let image;
    if (req.file) {
        image = req.file.filename;
    } else {
        image = null;
    }
    const {imagedesc, name, type, description, company, price, date, quantity} = req.body;
    const sql = 'UPDATE figurines SET image = ?, image_desc = ?, name = ?, type = ?, description = ?, company = ?, price = ?, date = ?, quantity = ? WHERE figurineID = ?';
    connection.query(sql, [image, imagedesc, name, type, description, company, price, date, quantity, figurineID], (error, results) => {
        if (error) {
            console.error("Error updating figurine:", error);
            res.status(500).send('Error updating figurine');
        } else {
            res.redirect('/figurines/view')
        }
    });
});

app.get('/cart', (req, res) => {
  res.render('cart');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.post('/contact', (req,res) => {
    const {name, email, contact_num, company, brand} = req.body;
    const sql = 'INSERT INTO contacts (name, email, contact_num, company, brand) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [name, email, contact_num, company, brand], (error, results) => {
        if (error) {
            console.error('Error adding contact:', error);
            res.status(500).send("Error adding contact");
        } else {
            res.redirect('/contact/submit')
        }
    });
});

app.get('/contact/submit', (req, res) => {
    res.render('submit');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

// Why are you down here, pls go away