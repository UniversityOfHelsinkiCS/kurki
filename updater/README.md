# kurki-updater

## Development setup

1. Create a `.env` file in the root directory with contents of the `.env.template` file. You will need to request the value of the `SIS_IMPORTER_API_TOKEN` from Toska to be able to finish the development setup.

2. Follow the development setup in the main README.

3. Once the setup is finished (especially the database), follow the instructions in the "Database requirements" section.

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
