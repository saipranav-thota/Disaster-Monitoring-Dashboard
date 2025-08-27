-- Database schema for wildfire monitoring system

CREATE TABLE IF NOT EXISTS wildfires (
    id SERIAL PRIMARY KEY,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    confidence INTEGER NOT NULL,
    brightness FLOAT,
    scan_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
