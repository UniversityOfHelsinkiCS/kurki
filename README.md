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

Muuta tarvittaessa db-url tiedostoon _kurki.cnf_ (hakemistossa Web-pages/WEB_INF) tiedosto ei ole repositoriossa!

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


