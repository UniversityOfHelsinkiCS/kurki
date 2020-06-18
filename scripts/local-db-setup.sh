#!/bin/bash

echo "Testidb password:";
read acual_password;

acual_sid="opetest2"
acual_user="tk_opha"

dev_sid="opetest2"      # Set to kurki.cnf as instructed by README
dev_user="tk_opha"      # Set to kurki.cnf as instructed by README
dev_password="salasana" # Set to kurki.cnf as instructed by README

db_init1="connect system/oracle@(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(Host=localhost)(Port=1521))(CONNECT_DATA=(SID=${dev_sid})))
alter session set \"_ORACLE_SCRIPT\"=true;
CREATE user ${dev_user} identified by ${dev_password};
GRANT create any table to ${dev_user};
GRANT unlimited tablespace to ${dev_user};
GRANT create session to ${dev_user};
GRANT create database link to ${dev_user};
GRANT create any directory to ${dev_user};"

db_init2="connect ${dev_user}/${dev_password}@(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(Host=localhost)(Port=1521))(CONNECT_DATA=(SID=${dev_sid})))
CREATE directory my_data as '/u01/app/oracle';
DROP DATABASE LINK remote;
CREATE DATABASE LINK remote CONNECT TO tk_opha IDENTIFIED BY ${acual_password} USING '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(Host=localhost)(Port=1525))(CONNECT_DATA=(SID=${acual_sid})))';"

move_stuff="impdp ${dev_user}/${dev_password}@${dev_sid} network_link=remote directory=my_data logfile=imported.log"

# bash quotation mark hell escaped by splitting
docker exec kurki-db bash -c "echo '${db_init1}' | sqlplus /nolog"
docker exec kurki-db bash -c "echo \"${db_init2}\" | sqlplus /nolog"

docker exec kurki-db ${move_stuff}

