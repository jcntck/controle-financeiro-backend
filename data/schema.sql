CREATE TABLE categories(
  id SERIAL CONSTRAINT pk_id_category PRIMARY KEY,
  name varchar(250) NOT NULL UNIQUE,
  color char(7) NOT NULL UNIQUE
);

CREATE TABLE debit_transactions(
  id SERIAL CONSTRAINT pk_id_debit_transactions PRIMARY KEY,
  transaction_date DATE NOT NULL,
  amount REAL NOT NULL,
  description VARCHAR(255) NOT NULL,
  transaction_type CHAR(1) NOT NULL,
  external_id VARCHAR(255) UNIQUE,
  category_id SERIAL NOT NULL,
  CONSTRAINT fk_debit_transactions_categories FOREIGN KEY(category_id) REFERENCES categories(id)
);

CREATE TABLE credit_transactions(
  id SERIAL CONSTRAINT pk_id_credit_transactions PRIMARY KEY,
  transaction_date DATE NOT NULL,
  amount REAL NOT NULL,
  description VARCHAR(255) NOT NULL,
  recurring_transaction BOOLEAN DEFAULT FALSE,
  category_id SERIAL NOT NULL,
  CONSTRAINT fk_credit_transactions_categories FOREIGN KEY(category_id) REFERENCES categories(id)
);

CREATE TABLE installments(
  id SERIAL CONSTRAINT pk_id_installments PRIMARY KEY,
  installments INT NOT NULL,
  paid BOOLEAN DEFAULT FALSE,
  credit_transaction_id SERIAL NOT NULL,
  CONSTRAINT fk_credit_transactions_installments FOREIGN KEY(credit_transaction_id) REFERENCES credit_transactions(id)
);