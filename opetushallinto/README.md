# Opetushallinto

## Development

1. Server requires token for [sis-importer](https://github.com/UniversityOfHelsinkiCS/sis-importer). In the `server` directory, copy contents of the `.env.template` file into a `.env` file and replace the placeholders with actual values

2. If you want to develop the entire application (client and server), run `docker-compose up opetushallinto-client` in the repository's root directory. If only want to develop the server, run `docker-compose up opetushallinto-server`

3. Once containers are running, the server is available at http://localhost:5000 and client at http://localhost:5001
