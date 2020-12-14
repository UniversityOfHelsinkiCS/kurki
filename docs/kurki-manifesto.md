## database ##

We use oracle *DATABASE_LINK* technology to fetch the development database. This is practically the same as fetching dump and then inputting dump to the database. The `scripts/fetch_db.sh` is executed **inside of the database container**. To help the execution we have `scripts/local-db-setup.sh` which literally just goes inside the database container and executes the fetch_db.sh. See contents of fetch_db.sh for the steps.

1. Create relevant users, directories and database link.

2. Create tunnel to test database

3. impdp to *import* data from test database to local

## run.sh ##

`./run.sh kurki up` is just `docker-compose up <kurki-relevant-services>`

`./run.sh updater up` is just `docker-compose up <updater-relevant-services>`

`./run.sh updater up -d --build` is just `docker-compose up -d --build <updater-relevant-services>`

As you can see ./run.sh is literally just docker-compose but makes sure that the right services are started. This is 1000x better than having multiple scripts.

There are two exceptions:

`docker-compose down` can not accept specific services and as such `./run.sh kurki down` will stop *all* services. Not just kurki specific. As such `./run.sh kurki down` === `./run.sh both down` === `./run.sh updater down`

`./run.sh morning` is a reference to oodikone morning.sh and resets everything.

## development ##

The kurki.cnf contains envs for kurki. Everything stays exactly the same as in production *except* the 3 lines with dbUser, dbPassword and dbServer which will point to the containerized database.

To fetch the database dump with database link we need to first start the application and then run the `local-db-setup` as described above in the database section.

Then it just works **but** you will need to use loginas service as the login system of kurki checks for uid header! Read the next section for details about loginas.

## loginas ##

loginas is a separate service that enables you to login as any user but is also required for running the application locally.

The functionality is simple. It proxies requests to kurki and adds one additional header uid that can be changed. uid is the AD username of the person you want to login as. By default its mluukkai.

## sqlplus ##

Sometimes you need to see what is going on in the production database.

Installing sqlplus is a headache so there's a container to connect to production database. See the sqlplus directory for information. It creates a tunnel to production database and connects there with the given credentials.

## updater ##

Updater fetches data from sis and stores it into the kurki database. See updater directory for more information. It can be run with or without kurki as they are not dependant on each other.