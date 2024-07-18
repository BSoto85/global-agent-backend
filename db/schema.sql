-- db/schema.sql
DROP DATABASE IF EXISTS global_agent;
CREATE DATABASE global_agent;

\c global_agent;

-- Add comments explaing what all columns are about
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

CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    flag TEXT NOT NULL,
    country_code VARCHAR(2),
    name VARCHAR(30),
    language_code VARCHAR(2)
);

-- Change names of older and younger to add demographic at the end
CREATE TABLE case_files (
    id SERIAL PRIMARY KEY,
    article_id INTEGER UNIQUE,
    article_content TEXT,
    article_title TEXT,
    publish_date VARCHAR(50),
    summary_young TEXT DEFAULT NULL,
    summary_old TEXT DEFAULT NULL,
    countries_id INTEGER REFERENCES countries(id),
    photo_url TEXT
);

CREATE TABLE questions_younger (
    id SERIAL PRIMARY KEY,
    y_question VARCHAR(150),
    y_correct_answer VARCHAR(100),
    y_incorrect_answer1 VARCHAR(100),
    y_incorrect_answer2 VARCHAR(100),
    y_incorrect_answer3 VARCHAR(100),
    y_case_files_article_id INTEGER REFERENCES case_files(article_id) ON DELETE CASCADE
);

CREATE TABLE questions_older (
    id SERIAL PRIMARY KEY,
    o_question VARCHAR(150),
    o_correct_answer VARCHAR(100),
    o_incorrect_answer1 VARCHAR(100),
    o_incorrect_answer2 VARCHAR(100),
    o_incorrect_answer3 VARCHAR(100),
    o_case_files_article_id INTEGER REFERENCES case_files(article_id) ON DELETE CASCADE
);
