kurki13
=======

Riippuvuuksien asennus lokaaliin maven-repositorioon (suorita hakemistossa lib)

<pre>
mvn install:install-file -Dfile=ojdbc7-12.1.0.jar -DgroupId=com.oracle -DartifactId=ojdbc7 -Dversion=12.1.0 -Dpackaging=jar
</pre>

Testiversio [https://ilmo.cs.helsinki.fi/t_kurki/servlet/index](https://ilmo.cs.helsinki.fi/t_kurki/servlet/index)

# deployment

[siirto staging-ympäristöön](https://github.com/UniversityOfHelsinkiCS/opetushallinto/blob/master/kurki13/docs/deploy-staging.md)

[siirto tuotantoympäristöön](https://github.com/UniversityOfHelsinkiCS/opetushallinto/blob/master/kurki13/docs/deploy-production.md)

# Development

Create a file _kurki.cnf_ into which you will copy the contents from kurki.cs.helsinki.fi. Make the following change to the file:

```
dbUser=tk_opha
dbPassword=salasana
dbServer=jdbc:oracle:thin:@kurki-db:1521:opetest2
```

The command `./run.sh kurki` will start up database, kurki and loginas service. The startup time for database is a long one, now is a good time to fetch a drink.

After this is the seeding of database.

1. Execute `scripts/local-db-setup.sh`

Now you can find "loginas" service from [http://localhost:3003/servlet/index](http://localhost:3003/servlet/index) and you can switch the user you're logged in as from `login/index.js`, or by visiting [http://localhost:3003/uid/mluukkai](http://localhost:3003/uid/mluukkai) where the last parameter is the uid. After changing you will need to press logout in kurki as it has its own session.

# Updater #

Use `./run.sh updater` or `./run.sh both` to run the updater either with our without kurki. The database is started regardless.

# Connecting to production database

Run `docker run -e USER="USERNAME" -it toska/kurki-sqlplus` where "USERNAME" is your ad username. Code can be found in the sqlplus folder.

Password can be found in kurki.cs.helsinki.fi in the _kurki.cnf_ file.

# vanhat development ohjeet

Muuta tarvittaessa db-url tiedostoon src/main/webapp/WEB_INF/kurki.cnf (tiedosto ei ole repositoriossa!)

Sovellus urlissa [http://localhost:8080/kurki13/servlet/index](http://localhost:8080/kurki13/servlet/index)

# tietokanta

tuotanto _svm-1.cs.helsinki.fi:1521:ope_

testikanta _svm-1.cs.helsinki.fi:1521:opetest2_

Molemmissa käyttäjätunnus *tk_opha* salasana ks. palvelinten _kurki.cnf_ 

## tietokantaskeema

Ks [https://github.com/UniversityOfHelsinkiCS/opetushallinto/tree/master/db](https://github.com/UniversityOfHelsinkiCS/opetushallinto/tree/master/db)

Dokumentoi skeeman muutokset tiedostoon [https://github.com/UniversityOfHelsinkiCS/opetushallinto/blob/master/db/opha_taulut_x.sql](https://github.com/UniversityOfHelsinkiCS/opetushallinto/blob/master/db/opha_taulut_x.sql)

## SQL-proseduurit

Päivitetyt proseduurit hakemistossa [https://github.com/UniversityOfHelsinkiCS/opetushallinto/tree/master/db](https://github.com/UniversityOfHelsinkiCS/opetushallinto/tree/master/db)

Muut [https://github.com/UniversityOfHelsinkiCS/opetushallinto/tree/master/kurki13/plsql](https://github.com/UniversityOfHelsinkiCS/opetushallinto/tree/master/kurki13/plsql)

Kantaan talletettujen proseduurien koodi selviää esim. kyselyllä

```
SELECT text 
FROM all_source
where name = 'RYHMAVAIHTO'
order by line
```

## proseduurin päivitys

Suorita proseduurin koodi sql-developerin konsolissa. Sen jälkeen komento ```commit``` saa muutoksen voimaan.
