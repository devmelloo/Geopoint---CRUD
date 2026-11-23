CREATE TABLE IF NOT EXISTS points (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    latitude NUMERIC(13, 10) NOT NULL CHECK (latitude BETWEEN -90 AND 90),
    longitude NUMERIC(13, 10) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    CONSTRAINT chk_points_name CHECK (LENGTH(TRIM(name)) > 0)
);
