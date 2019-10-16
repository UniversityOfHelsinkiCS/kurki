# deployaus tuotantoympäristöön

testaa ensin että kaikki toimii [staging-ympäristössä](https://github.com/UniversityOfHelsinkiCS/opetushallinto/blob/master/kurki13/docs/deploy-staging.md)

## mene tuotantopalvelimelle ja suorita deploy-skripti

Mene svm-82 ja vaihda käyttäjälle `kurki_user`. 

```
sudo su - kurki_user
```

Suorita deployment skripti

```
. /home/kurki_user/kurki/deploy.sh
```

Skriptin sisältö jotakuinkin seuraavanlainen:

```
git pull
docker build
docker-compose up
```

Joskus kannattanee ajaa seuraava komento, jotta säästetään tilaa:

```
docker image prune
```