#!/bin/sh
mvn clean install
t_tomcats stop t_kurki
rm /home/tkt_kurk/t_kurki/webapps/t_kurki.war
rm -rf /home/tkt_kurk/t_kurki/webapps/t_kurki
cp target/kurki13-1.0-SNAPSHOT.war /home/tkt_kurk/t_kurki/webapps/t_kurki.war
t_tomcats start t_kurki
sleep 2
cp /home/tkt_kurk/t_kurki/kurki-staging.cnf /home/tkt_kurk/t_kurki/webapps/t_kurki/WEB-INF/kurki.cnf