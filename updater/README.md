# kurki-updater

## Development setup

Initial setup

1. Follow the development setup in the main README if you did not already.

2. Run `./run.sh updater up` in the root folder (in which run.sh exists).

3. Create a `.env` file in the updater directory (in which this README exists) with contents of the `.env.template` file. You will need to request the value of the `SIS_IMPORTER_API_TOKEN` see Toska passwords.md in documentation repository. Title is **sis-importer-api-token**.

4. Once `kurki-db` container is ready, run `docker-compose run kurki-updater npm run migrate:latest` to run the migrations.

After completing initial setup at least once:

Run `./run.sh updater up` to run updater.

## If something suddenly stops working

Run `./run.sh updater up --build` to rebuild updater.
