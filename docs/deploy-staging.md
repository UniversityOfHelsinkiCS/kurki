# deployaus staging-ympäristöön

kirjaudu käyttäjätunnuksella _tkt_kurki_

staging-ympäristö sijaitsee hakemistossa *t_kurki*

konfiguraatiot hakemistossa sijaitsevassa tiedostossa _kurki-staging.cnf_

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
./scripts/deploy-staging.sh
```
