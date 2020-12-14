# kurki-updater

## Development setup

Initial setup

1. Follow the development setup in the main README if you did not already.

2. Run `./run.sh updater up` in the root folder (where run.sh exists).

3. Create a `.env` file in the updater directory (where this README exists) with contents of the `.env.template` file. You will need to request the value of the `SIS_IMPORTER_API_TOKEN` see Toska passwords.md in documentation repository. Title is **sis-importer-api-token**.

4. Run migrations / Database requirements **Kalle plz help**

After completing initial setup at least once:

Run `./run.sh updater up` to run updater.

## If something suddenly stops working ##

Run `./run.sh updater up --build` to rebuild updater.

## Database requirements

Updater requires additional columns in the database. You need to add the following columns manually:

- Add `SIS_ID` column for `Kurssi` table:

```sql
ALTER TABLE Kurssi ADD SIS_ID VARCHAR2(50) UNIQUE;
```

- Add `SIS_ID` column for `Opetus` table:

```sql
ALTER TABLE Opetus ADD SIS_ID VARCHAR2(50) UNIQUE;
```

- Add `SIS_ID` column for `Henkilo` table:

```sql
ALTER TABLE Henkilo ADD SIS_ID VARCHAR2(50) UNIQUE;
```

- Add `SIS_ID` column for `Opiskelija` table:

```sql
ALTER TABLE Opiskelija ADD SIS_ID VARCHAR2(50) UNIQUE;
```
