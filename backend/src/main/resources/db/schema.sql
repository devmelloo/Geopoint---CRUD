-- Banco PostgreSQL. A tabela sera criada automaticamente ao iniciar a API.
CREATE TABLE IF NOT EXISTS points (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    latitude NUMERIC(13, 10) NOT NULL,
    longitude NUMERIC(13, 10) NOT NULL,
    CONSTRAINT chk_points_name CHECK (LENGTH(TRIM(name)) > 0),
    CONSTRAINT chk_points_latitude CHECK (latitude BETWEEN -90 AND 90),
    CONSTRAINT chk_points_longitude CHECK (longitude BETWEEN -180 AND 180)
);

-- UNIQUE com LOWER protege contra duplicacao simultanea (inclusive maiusculas).
CREATE UNIQUE INDEX IF NOT EXISTS ux_points_name_lower ON points (LOWER(name));
