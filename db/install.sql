-- Yep y know that save passowd in code is bad idea
-- but i don't care
CREATE USER test WITH PASSWORD 'test';
CREATE DATABASE hospital OWNER test;


-- SELECT * FROM pg_stat_activity WHERE datname = 'hospital' and state = 'active';
-- DROP DATABASE hospital;
-- dropuser test -e