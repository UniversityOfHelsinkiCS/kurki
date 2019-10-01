# deployaus tuotantoympäristöön

testaa ensin että kaikki toimii [staging-ympäristössä](https://github.com/UniversityOfHelsinkiCS/opetushallinto/blob/master/kurki13/docs/deploy-staging.md)

kirjaudu käyttäjätunnuksella _tkt_ilmo_

staging-ympäristö sijaitsee hakemistossa *kurki*

konfiguraatiot hakemistossa sijaitsevassa tiedostossa _kurki-production.cnf_

## kloonaa repositorio

```
git clone https://github.com/UniversityOfHelsinkiCS/opetushallinto
```

## asenna tarvittaessa lib-hakemistossa oleva oracle jdbc -ajuri

```
mvn install:install-file -Dfile=ojdbc7-12.1.0.jar -DgroupId=com.oracle -DartifactId=ojdbc7 -Dversion=12.1.0 -Dpackaging=jar
```

## mene repositorioon ja suorita deployment-skripti

```
./scripts/deploy-production.sh
```

skriptio kopioi edellisen version hakemistoon */home/tktl_ilmo/kurki/kurki_previous*