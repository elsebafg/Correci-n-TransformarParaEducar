-- Base de datos para el Centro Educativo "Educar para Transformar"
-- Motor: PostgreSQL

-- Extensión para IDs únicos si se desea (opcional, usaremos SERIAL o UUID)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de Roles de Usuario
CREATE TYPE user_role AS ENUM ('docente', 'padre', 'alumno', 'autoridad');

-- Tabla de Usuarios
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol user_role NOT NULL,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- Tabla de Niveles Educativos
CREATE TYPE nivel_educativo AS ENUM ('inicial', 'primario', 'secundario');

-- Tabla de Inscripciones
CREATE TABLE inscripciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_aspirante VARCHAR(100) NOT NULL,
    apellido_aspirante VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    nivel nivel_educativo NOT NULL,
    nombre_tutor VARCHAR(100) NOT NULL,
    apellido_tutor VARCHAR(100) NOT NULL,
    email_contacto VARCHAR(150) NOT NULL,
    telefono_contacto VARCHAR(50) NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente', -- pendiente, aprobada, rechazada
    fecha_solicitud TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Noticias
CREATE TABLE noticias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    imagen_url VARCHAR(255),
    autor_id UUID NOT NULL,
    fecha_publicacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_noticia_autor FOREIGN KEY (autor_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de Postulaciones de Empleo
CREATE TABLE postulaciones_empleo (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    puesto_aplicado VARCHAR(150) NOT NULL, -- Ej: Docente Matemáticas, Personal Mantenimiento
    cv_url VARCHAR(255) NOT NULL, -- Link al documento del CV
    mensaje TEXT,
    fecha_postulacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Comentarios / Opiniones (Públicas, sin login)
CREATE TABLE opiniones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_autor VARCHAR(100) NOT NULL,
    comentario TEXT NOT NULL,
    aprobado BOOLEAN DEFAULT FALSE, -- Para moderación antes de publicar
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar rendimiento de búsquedas comunes
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_inscripciones_estado ON inscripciones(estado);
CREATE INDEX idx_noticias_fecha ON noticias(fecha_publicacion DESC);
