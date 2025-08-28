-- Database schema for wildfire monitoring system

CREATE TABLE IF NOT EXISTS viirs_live_data (
    h3_cell TEXT NOT NULL,
    time_bucket TIMESTAMP NOT NULL,
    confidence TEXT,
    frp FLOAT,
    daynight CHAR(1),
    PRIMARY KEY (h3_cell, time_bucket)
);

CREATE TABLE IF NOT EXISTS viirs_historical_data (
    h3_cell TEXT NOT NULL,
    time_bucket TIMESTAMP NOT NULL,
    confidence TEXT,
    frp FLOAT,
    daynight CHAR(1),
    PRIMARY KEY (h3_cell, time_bucket)
);

