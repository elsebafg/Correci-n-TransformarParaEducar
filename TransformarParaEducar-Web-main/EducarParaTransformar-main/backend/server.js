import express from 'express';
import cors from 'cors';
import dbPromise, { initDb } from './db.js';

import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize Database
initDb().then(() => {
  console.log("SQLite database initialized successfully.");
}).catch(err => {
  console.error("Failed to initialize database", err);
});

// Rutas de Noticias
app.get('/api/news', async (req, res) => {
  const db = await dbPromise;
  const news = await db.all('SELECT * FROM noticias ORDER BY id DESC');
  res.json(news.map(n => ({
    ...n,
    title: n.titulo,
    summary: n.resumen,
    contenido: n.contenido,
    tag: n.etiqueta,
    date: n.fecha
  })));
});

app.get('/api/news/:id', async (req, res) => {
  const db = await dbPromise;
  const id = parseInt(req.params.id);
  const newsItem = await db.get('SELECT * FROM noticias WHERE id = ?', id);
  if (newsItem) {
    res.json({
      ...newsItem,
      title: newsItem.titulo,
      summary: newsItem.resumen,
      contenido: newsItem.contenido,
      tag: newsItem.etiqueta,
      date: newsItem.fecha,
      imagen: newsItem.imagen
    });
  } else {
    res.status(404).json({ message: 'News not found' });
  }
});

app.post('/api/news', upload.single('imagen'), async (req, res) => {
  const db = await dbPromise;
  const { title, summary, contenido, tag, date } = req.body;
  const imagen = req.file ? '/uploads/' + req.file.filename : null;
  const result = await db.run(
    'INSERT INTO noticias (titulo, resumen, contenido, etiqueta, fecha, imagen) VALUES (?, ?, ?, ?, ?, ?)',
    [title, summary, contenido || '', tag || 'General', date || 'Justo ahora', imagen]
  );
  const newPost = await db.get('SELECT * FROM noticias WHERE id = ?', result.lastID);
  res.status(201).json({
    ...newPost,
    title: newPost.titulo,
    summary: newPost.resumen,
    contenido: newPost.contenido,
    tag: newPost.etiqueta,
    date: newPost.fecha,
    imagen: newPost.imagen
  });
});

app.delete('/api/news/:id', async (req, res) => {
  const db = await dbPromise;
  const id = parseInt(req.params.id);
  await db.run('DELETE FROM noticias WHERE id = ?', id);
  res.json({ message: 'News deleted' });
});

app.put('/api/news/:id', upload.single('imagen'), async (req, res) => {
  const db = await dbPromise;
  const id = parseInt(req.params.id);
  const { title, summary, contenido, tag } = req.body;
  const newsItem = await db.get('SELECT * FROM noticias WHERE id = ?', id);
  if (!newsItem) {
    return res.status(404).json({ message: 'News not found' });
  }

  let imagen = newsItem.imagen;
  if (req.file) {
    imagen = '/uploads/' + req.file.filename;
  }

  await db.run(
    'UPDATE noticias SET titulo = ?, resumen = ?, contenido = ?, etiqueta = ?, imagen = ? WHERE id = ?',
    [
      title || newsItem.titulo,
      summary || newsItem.resumen,
      contenido !== undefined ? contenido : newsItem.contenido,
      tag || newsItem.etiqueta,
      imagen,
      id
    ]
  );

  const updatedPost = await db.get('SELECT * FROM noticias WHERE id = ?', id);
  res.json({
    ...updatedPost,
    title: updatedPost.titulo,
    summary: updatedPost.resumen,
    contenido: updatedPost.contenido,
    tag: updatedPost.etiqueta,
    date: updatedPost.fecha,
    imagen: updatedPost.imagen
  });
});

// Rutas de Opiniones
app.get('/api/reviews', async (req, res) => {
  const db = await dbPromise;
  const reviews = await db.all('SELECT * FROM opiniones ORDER BY id DESC');
  res.json(reviews.map(r => ({ ...r, author: r.autor, text: r.texto, date: r.fecha })));
});

app.post('/api/reviews', async (req, res) => {
  const db = await dbPromise;
  const { author, text, date } = req.body;
  const result = await db.run(
    'INSERT INTO opiniones (autor, texto, fecha) VALUES (?, ?, ?)',
    [author, text, date]
  );
  const newReview = await db.get('SELECT * FROM opiniones WHERE id = ?', result.lastID);
  res.status(201).json({ ...newReview, author: newReview.autor, text: newReview.texto, date: newReview.fecha });
});

app.delete('/api/reviews/:id', async (req, res) => {
  const db = await dbPromise;
  const id = parseInt(req.params.id);
  await db.run('DELETE FROM opiniones WHERE id = ?', id);
  res.json({ message: 'Review deleted' });
});

// Rutas de Empleo (Postulaciones)
app.get('/api/jobs', async (req, res) => {
  const db = await dbPromise;
  const jobs = await db.all('SELECT * FROM postulaciones_empleo ORDER BY id DESC');
  res.json(jobs);
});

app.post('/api/jobs', async (req, res) => {
  const db = await dbPromise;
  const { nombre, apellido, email, telefono, puesto, cv_url, mensaje } = req.body;
  try {
    const result = await db.run(
      'INSERT INTO postulaciones_empleo (nombre, apellido, email, telefono, puesto, cv_url, mensaje) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, apellido, email, telefono, puesto, cv_url, mensaje]
    );
    res.status(201).json({ id: result.lastID, message: 'Postulación enviada correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al enviar la postulación' });
  }
});

// Rutas de Usuarios
app.get('/api/users', async (req, res) => {
  const db = await dbPromise;
  const users = await db.all('SELECT * FROM usuarios ORDER BY id DESC');
  const formattedUsers = users.map(u => ({ ...u, activo: u.activo === 1 }));
  res.json(formattedUsers);
});

app.post('/api/login', async (req, res) => {
  const db = await dbPromise;
  const { email, password } = req.body;
  const user = await db.get('SELECT * FROM usuarios WHERE email = ? AND password = ?', [email, password]);

  if (user) {
    if (user.activo === 0) return res.status(403).json({ message: 'Usuario bloqueado' });
    user.activo = true;
    res.json(user);
  } else {
    res.status(401).json({ message: 'Credenciales inválidas' });
  }
});

app.post('/api/users', async (req, res) => {
  const db = await dbPromise;
  const { nombre, email, password, rol } = req.body;

  try {
    const result = await db.run(
      'INSERT INTO usuarios (nombre, email, password, rol, activo) VALUES (?, ?, ?, ?, 1)',
      [nombre, email, password, rol]
    );
    const newUser = await db.get('SELECT * FROM usuarios WHERE id = ?', result.lastID);
    newUser.activo = true;
    res.status(201).json(newUser);
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE constraint')) {
      return res.status(400).json({ message: 'El correo ya está registrado.' });
    }
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const db = await dbPromise;
  const id = parseInt(req.params.id);
  const { activo, password } = req.body;

  if (activo !== undefined) {
    await db.run('UPDATE usuarios SET activo = ? WHERE id = ?', [activo ? 1 : 0, id]);
  }

  if (password !== undefined) {
    await db.run('UPDATE usuarios SET password = ? WHERE id = ?', [password, id]);
  }

  const user = await db.get('SELECT * FROM usuarios WHERE id = ?', id);
  if (user) {
    user.activo = user.activo === 1;
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const db = await dbPromise;
  const id = parseInt(req.params.id);
  await db.run('DELETE FROM usuarios WHERE id = ?', id);
  res.json({ message: 'User deleted' });
});

// Ruta para procesar la Solicitud de Inscripción
app.post('/api/inscripciones', async (req, res) => {
  const db = await dbPromise;

  // IMPORTANTE: Estos nombres deben coincidir EXACTAMENTE con el "name" 
  // de tus inputs en el formulario de React (archivo Registration.jsx)
  const {
    nombreAspirante,
    apellidoAspirante,
    dniAspirante,
    nivel,
    nombreTutor,
    apellidoTutor,
    dniTutor,
    email,
    telefono
  } = req.body;

  try {
    const result = await db.run(
      `INSERT INTO inscripciones (
        nombre_aspirante,
        apellido_aspirante,
        dni_aspirante,
        nivel,
        nombre_tutor,
        apellido_tutor,
        dni_tutor,
        email_contacto,
        telefono_contacto
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombreAspirante,
        apellidoAspirante,
        dniAspirante,
        nivel,
        nombreTutor,
        apellidoTutor,
        dniTutor,
        email,
        telefono
      ]
    );

    // Seguimos la misma estructura que tu ruta de jobs
    res.status(201).json({
      id: result.lastID,
      message: 'Solicitud de inscripción enviada correctamente'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al enviar la inscripción' });
  }
});

app.get('/api/inscripciones', async (req, res) => {
  const db = await dbPromise;
  // Traemos las inscripciones ordenadas por la más reciente
  const inscripciones = await db.all('SELECT * FROM inscripciones ORDER BY id DESC');
  res.json(inscripciones);
});

// Rutas de Eventos
app.get('/api/events', async (req, res) => {
  const db = await dbPromise;
  const events = await db.all('SELECT * FROM eventos ORDER BY id ASC');
  res.json(events);
});

app.post('/api/events', async (req, res) => {
  const db = await dbPromise;
  const { titulo, descripcion, dia, mes, hora, lugar, tag } = req.body;
  try {
    const result = await db.run(
      'INSERT INTO eventos (titulo, descripcion, dia, mes, hora, lugar, tag) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [titulo, descripcion, dia, mes, hora, lugar, tag || 'General']
    );
    const newEvent = await db.get('SELECT * FROM eventos WHERE id = ?', result.lastID);
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ message: 'Error al guardar el evento' });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  const db = await dbPromise;
  const id = parseInt(req.params.id);
  await db.run('DELETE FROM eventos WHERE id = ?', id);
  res.json({ message: 'Event deleted' });
});

app.use(express.static(path.join(__dirname, '../dist')));
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});