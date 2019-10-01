Kurki tuotantoonsiirto:

0. Olkoon työhakemistona tkt_kurk@ilmo:t_kurki

1. Tee sovellushakemistosta ./webapps/t_kurki kopio
   hakemistoon ./kurki
   (hävitä tai uudelleennimeä tarvittaessa hamemiston ./kurki vanha sisältö ennen kopion tekoa)

   cp ./webapps/t_kurki/* ./kurki/

2. Korvaa tiedostot .kurki/WEB-INF/kurki.cnf ja
   ./kurki/WEB-INF/web.xml
   tuotantoympäristön konfiguraatiotiedostoilla
   ./tuotanto_kurki_cnf.txt ja ./tuotanto_web_xml.txt

   cp tuotanto_kurki_cnf.txt ./kurki/WEB-INF/kurki.cnf
   cp tuotanto_web_xml.txt  ./kurki/WEB-INF/web.xml

   (Huom: olisi parempi säilyttää tuotannon konfaustietoja
   tuotantoympäristössä ja tehdä vaihto vasta
   tuotantoympäristöön siirron jälkeen, jotta tuotannon tietoja ei lojuisi
   monessa paikassa - mutta nyt on näin)

3. Tee siirtoa varten tar-paketti hakemistosta ./kurki
   (kopioi edellinen tar-paketti ensin toiselle nimelle - jos tarpeen)

   tar -cvzf kurki_tuotanto.tar.gz ./kurki


4. Siirrä tar-paketti ilmo-ympäristöön

   scp -2 -i ~/identity_ilmo kurki_tuotanto.tar.gz
tkt_ilmo@ilmo:kurki/webapps/


5. Siirry ilmon tuotantoympäristöön (avaintiedosto: identity_ilmo)
   ssh -i ~/identity_ilmo -l tkt_ilmo svm-3

6. Aja kurki alas (oletetaan, että työhakemistona on tkt_ilmon päähakemisto)

   ./bin/ilmo stop kurki

7. Siirry hakemistoon ./kurki/webapps

   cd ./kurki/webapps

8. Ota talteen vanha tuotantosovellus mahdollista pikapalautusta varten

   cp -r kurki ../kurki_tuotanto_edellinen_versio

9. Tyhjennä hakemisto ~/kurki/webapps/kurki
   Jos työhakemistona on ~/kurki/webapps niin
   rm -r kurki/*

10. Pura lataamasi tar-paketti hakemistoon ~/kurki/webapps/kurki
    Jos työhakemistona on ~/kurki/webapps niin
   tar -xvzf kurki_tuotanto.tar.gz ./kurki/

11. Varmista että kaikki siirtyi ja konfaustiedot ovat kunnossa
    (WEB-INF/web.xml ja kurki.cnf)

12. Käynnistä kurki
    ~/bin/ilmo start kurki

13. Kokeile selaimella toimiiko tuotanto.

14. Poistu ilmo-tuotantoympäristöstä
    exit
