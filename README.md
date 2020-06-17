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

# development

Tee projektin juureen tiedosto _kurki.cnf_ jonka sisällön kopioit kurki.cs.helsinki.fi palvelimelta. Tee tiedostoon seuraava muutos:

```
dbUser=tk_opha
dbPassword=salasana
dbServer=jdbc:oracle:thin:@kurki-db:1521:opetest2
```

Komento `docker-compose up` käynnistää kaiken tarpeellisen. Tietokannan käynnistyksessä kestää, hyvä aika hakea kahvit.

Tämän jälkeen tietokannan alustus. Devaustietokannan pystytyksessä on parannettavan varaa:

1. Suorita `scripts/local-db-tunnel.sh`. Tunnelin on oltava päällä seuraavaa suorittaessa.

2. Suorita `scripts/local-db-setup.sh`.

Nyt löytyy "loginas" palvelu osoitteesta [http://localhost:3003/servlet/index](http://localhost:3003/servlet/index). Voit vaihtaa henkilön jona olet kirjautunut tiedostossa `loginas/index.js`, muutokset tulevat voimaan automaattisesti, mutta kurki säästää session joten joudut kirjautumaan ulos vaihtaessasi käyttäjää.

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


## Local stuff

```
ssh -J melkki.cs.helsinki.fi -L 1521:svm-1.cs.helsinki.fi:1521 kurki.cs.helsinki.fi
```

Niin lokaalisti toimii `sqlplus /nolog` ja `connect tk_opha@(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(Host=localhost)(Port=1521))(CONNECT_DATA=(SID=ope)))` Salasana löytyy kurki.cs.helsinki.fi palvelimen _kurki.cnf_ 

Ez asennusohjeet tolle sqlplussalle oli https://zwbetz.com/install-sqlplus-on-a-mac/ (bumppaa itse versionumerot)
