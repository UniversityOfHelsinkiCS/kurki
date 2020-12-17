# Development #

**Step 1:** `touch kurki.cnf` (into the root) and **copy the contents from kurki.cs.helsinki.fi** there or ask another developer to supply. Make the following change to the file:

```
dbUser=tk_opha
dbPassword=salasana
dbServer=jdbc:oracle:thin:@kurki-db:1521:opetest2
```

**Step 2:** `./run.sh kurki up`.  The startup time for database is **LONG**. It isn't stuck unless it stays there for hours.

**Step 3:** `scripts/local-db-setup.sh`. This seeds the database.

**Step 4:** See that the application works in [http://localhost:3003/servlet/index](http://localhost:3003/servlet/index).

**If something is broken see the next section with title "Something broken locally" and restart from Step 1**

After initial setup:

You can use `./run.sh kurki up` to run kurki. `./run.sh updater up` to run updater. Or `./run.sh both up` to run both. Use `./run.sh both down` to run them down.

Now you can find "loginas" service from [http://localhost:3003/servlet/index](http://localhost:3003/servlet/index) and you can switch the user you're logged in as from `login/index.js`, or by visiting [http://localhost:3003/uid/mluukkai](http://localhost:3003/uid/mluukkai) where the last parameter is the uid. After changing you will need to press logout in kurki as it has its own session.

**Finally acual kurki development**

Updated code? Run `./run.sh kurki up --build` to build and recreate Kurki.

# Something broken locally # 

**Execute** `./run.sh morning` and go to **Development** section Step 1. This will remove the `./oracle_data` directory as well as all images, volumes and containers in this project. 

Data is saved in `./oracle_data` so removing that will reset the oracle database. Recreating it will take a long time, but if it's not destroyed the startup time will be quicker.

# Updater #

Go to [https://github.com/UniversityOfHelsinkiCS/kurki/tree/master/updater](https://github.com/UniversityOfHelsinkiCS/kurki/tree/master/updater) after you have **confirmed that Development steps 1-4 work**.

Follow the **README.md** in updater!

Use `./run.sh updater up` or `./run.sh both up` to run the updater either with our without kurki. If you need to rebuild use `--build`, e.g. `./run.sh updater up --build` The database is started regardless.

# Connecting to production database #

The local database can not be connected to production database. But you can use sqlplus to manipulate production.

Run `docker run -e USER="USERNAME" -it toska/kurki-sqlplus` where "USERNAME" is your ad username. Code can be found in the sqlplus folder.

Password can be found in kurki.cs.helsinki.fi in the _kurki.cnf_ file.

# Production deployment #

See guide here [https://github.com/UniversityOfHelsinkiCS/kurki/blob/master/docs/deploy-production.md](https://github.com/UniversityOfHelsinkiCS/kurki/blob/master/docs/deploy-production.md)

# login as

Login as another user:

1.go to  https://kurki.cs.helsinki.fi/loginas/servlet/index
2. then https://kurki.cs.helsinki.fi/loginas/uid/jakousa where jakousa is the uid of the user you want to log in as 

3. go back to https://kurki.cs.helsinki.fi/loginas/servlet/index and log out
4. go again to https://kurki.cs.helsinki.fi/loginas/servlet/index

# Old development guide below, might still contain useful info / Vanhat development ohjeet alla, saattaa sisältää vieläkin jotain hyödyllistä #

kurki13
=======

Riippuvuuksien asennus lokaaliin maven-repositorioon (suorita hakemistossa lib)

<pre>
mvn install:install-file -Dfile=ojdbc7-12.1.0.jar -DgroupId=com.oracle -DartifactId=ojdbc7 -Dversion=12.1.0 -Dpackaging=jar
</pre>

Testiversio [https://ilmo.cs.helsinki.fi/t_kurki/servlet/index](https://ilmo.cs.helsinki.fi/t_kurki/servlet/index)

## old deployment ##

[siirto staging-ympäristöön](https://github.com/UniversityOfHelsinkiCS/opetushallinto/blob/master/kurki13/docs/deploy-staging.md)

[siirto tuotantoympäristöön](https://github.com/UniversityOfHelsinkiCS/opetushallinto/blob/master/kurki13/docs/deploy-production.md)

## old development ##

Muuta tarvittaessa db-url tiedostoon src/main/webapp/WEB_INF/kurki.cnf (tiedosto ei ole repositoriossa!)

Sovellus urlissa [http://localhost:8080/kurki13/servlet/index](http://localhost:8080/kurki13/servlet/index)

## old tietokanta ##

tuotanto _svm-1.cs.helsinki.fi:1521:ope_

testikanta _svm-1.cs.helsinki.fi:1521:opetest2_

Molemmissa käyttäjätunnus *tk_opha* salasana ks. palvelinten _kurki.cnf_ 

## old tietokantaskeema ##

Ks [https://github.com/UniversityOfHelsinkiCS/opetushallinto/tree/master/db](https://github.com/UniversityOfHelsinkiCS/opetushallinto/tree/master/db)

Dokumentoi skeeman muutokset tiedostoon [https://github.com/UniversityOfHelsinkiCS/opetushallinto/blob/master/db/opha_taulut_x.sql](https://github.com/UniversityOfHelsinkiCS/opetushallinto/blob/master/db/opha_taulut_x.sql)

## old SQL-proseduurit ##

Päivitetyt proseduurit hakemistossa [https://github.com/UniversityOfHelsinkiCS/opetushallinto/tree/master/db](https://github.com/UniversityOfHelsinkiCS/opetushallinto/tree/master/db)

Muut [https://github.com/UniversityOfHelsinkiCS/opetushallinto/tree/master/kurki13/plsql](https://github.com/UniversityOfHelsinkiCS/opetushallinto/tree/master/kurki13/plsql)

Kantaan talletettujen proseduurien koodi selviää esim. kyselyllä

```
SELECT text 
FROM all_source
where name = 'RYHMAVAIHTO'
order by line
```

## old proseduurin päivitys

Suorita proseduurin koodi sql-developerin konsolissa. Sen jälkeen komento ```commit``` saa muutoksen voimaan.
