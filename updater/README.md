# kurki-updater

## Development setup

Initial setup

1. Follow the development setup in the main README if you did not already.

2. Run `./run.sh updater up` in the root folder (in which run.sh exists).

3. Create a `.env` file in the updater directory (in which this README exists) with contents of the `.env.template` file. You will need to request the value of the `SIS_IMPORTER_API_TOKEN` see Toska passwords.md in documentation repository. Title is **sis-importer-api-token**. The `OPETUSHALLINTO_API_KEY` is optional, you can remove it or use the same API key as in the `opetushallinto-server` container.

4. Run `docker-compose run kurki-updater npm run migrate:latest` to run the database migrations.

After completing initial setup at least once:

Run `./run.sh updater up` to run updater.

## If something suddenly stops working

Run `./run.sh updater up --build` to rebuild updater.

## Opetushallinto server

Updater tries to send reports (logs and status reports) to the `opetushallinto-server` container. Failure to send reports will cause error messages in the logs. Reports are disabled by default in the `docker-compose.yml` file, but you can enable them by passing a `SEND_REPORTS=true` environment variable. For example:

```bash
docker-compose run -e SEND_REPORTS=true kurki-updater npm run courses TKT20010
```
