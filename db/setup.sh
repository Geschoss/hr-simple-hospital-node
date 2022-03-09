psql -f install.sql -U postgres
PGPASSWORD=test psql -d hospital -f structure.sql -U test
PGPASSWORD=test psql -d hospital -f data.sql -U test
