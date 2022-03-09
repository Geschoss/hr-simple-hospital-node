CREATE TYPE Sex AS ENUM ('man', 'woman');

CREATE TABLE "Patient" (
  "id" bigint generated always as identity,
  "fullName" varchar(150) NOT NULL,
  "sex" Sex NOT NULL,
  "bithday" date NOT NULL,
  "address" varchar(250), 
  "OMS" varchar(16),
  "archived" boolean
);

ALTER TABLE "Patient" ADD CONSTRAINT "pkPatient" PRIMARY KEY ("id");
