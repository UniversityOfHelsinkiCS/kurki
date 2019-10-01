#!/bin/sh

echo "oletko varma (kyllä/ei)? "
read answer
if echo "$answer" | grep -iq "^kyllä" ;then
  echo "deployataan..."
else
  exit
fi

mvn clean install
/home/tkt_ilmo/bin/ilmo stop kurki
rm /home/tkt_ilmo/t_kurki/webapps/kurki.war
cp -rf /home/tkt_ilmo/kurki/webapps/kurki /home/tkt_ilmo/kurki/kurki_previous
rm -rf /home/tkt_ilmo/kurki/webapps/kurki
cp target/kurki13-1.0-SNAPSHOT.war /home/tkt_ilmo/kurki/webapps/kurki.war
/home/tkt_ilmo/bin/ilmo start kurki
sleep 2
cp /home/tkt_ilmo/kurki/kurki-production.cnf /home/tkt_ilmo/kurki/webapps/kurki/WEB-INF/kurki.cnf