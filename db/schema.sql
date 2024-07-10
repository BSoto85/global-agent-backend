-- db/schema.sql
DROP DATABASE IF EXISTS global_agent;
CREATE DATABASE global_agent;

\c global_agent;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    uid VARCHAR(255),
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    dob DATE,
    photo TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stats (
    id SERIAL PRIMARY KEY,
    xp INTEGER DEFAULT 0,
    games_played INTEGER DEFAULT 0,
    questions_correct INTEGER DEFAULT 0,
    questions_wrong INTEGER DEFAULT 0,
    user_id INTEGER REFERENCES users(id)
);

-- CREATE TABLE badges (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(100),
--     image TEXT NOT NULL,
--     description VARCHAR(200),
--     xp_required INTEGER NOT NULL
-- );

CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    flag TEXT NOT NULL,
    country_code VARCHAR(2),
    name VARCHAR(30)
);

-- CREATE TABLE user_badges (
--     id SERIAL PRIMARY KEY,
--     badge_id INTEGER NOT NULL REFERENCES badges(id),
--     user_id INTEGER NOT NULL REFERENCES users(id)
-- );

-- CREATE TABLE visited_countries (
--    id SERIAL PRIMARY KEY,
--    countries_id INTEGER NOT NULL REFERENCES countries(id),
--    user_id INTEGER NOT NULL REFERENCES users(id)
-- );

CREATE TABLE case_files (
    id SERIAL PRIMARY KEY,
    article_id INTEGER UNIQUE,
    article_content TEXT,
    article_title TEXT,
    publish_date VARCHAR(50),
    summary_young TEXT,
    summary_old TEXT,
    countries_id INTEGER REFERENCES countries(id),
    photo_url TEXT
);

-- CREATE TABLE photos (
--     id SERIAL PRIMARY KEY,
--     photo_url TEXT,
--     article_id INTEGER,
--     caption TEXT,
--     case_files_id INTEGER REFERENCES case_files(id) ON DELETE CASCADE
-- );

CREATE TABLE questions_younger (
    id SERIAL PRIMARY KEY,
    question VARCHAR(150),
    correct_answer VARCHAR(100),
    incorrect_answer1 VARCHAR(100),
    incorrect_answer2 VARCHAR(100),
    incorrect_answer3 VARCHAR(100),
    case_files_article_id INTEGER REFERENCES case_files(article_id) ON DELETE CASCADE
);

CREATE TABLE questions_older (
    id SERIAL PRIMARY KEY,
    question VARCHAR(150),
    correct_answer VARCHAR(100),
    incorrect_answer1 VARCHAR(100),
    incorrect_answer2 VARCHAR(100),
    incorrect_answer3 VARCHAR(100),
    case_files_article_id INTEGER REFERENCES case_files(article_id) ON DELETE CASCADE
);
