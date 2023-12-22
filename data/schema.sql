CREATE TABLE categories(
  id SERIAL CONSTRAINT pk_id_category PRIMARY KEY,
  name varchar(250) NOT NULL UNIQUE,
  color char(7) NOT NULL UNIQUE
);