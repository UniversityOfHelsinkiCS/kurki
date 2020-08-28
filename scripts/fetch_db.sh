#!/bin/bash

# This script is intended to be run inside the container. It's in a volume to database container

echo "AD-username:";
read username;

echo "Testidb password:";
read acual_password;

dev_sid="opetest2"      # Set to kurki.cnf as instructed by README
dev_user="tk_opha"      # Set to kurki.cnf as instructed by README
dev_password="salasana" # Set to kurki.cnf as instructed by README

echo "connect system/oracle@(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(Host=localhost)(Port=1521))(CONNECT_DATA=(SID=${dev_sid})))
alter session set \"_ORACLE_SCRIPT\"=true;
CREATE user ${dev_user} identified by ${dev_password};
CREATE user TK_OPE;
GRANT ALL PRIVILEGES TO ${dev_user};
DROP directory my_data;
CREATE directory my_data as '/u01/app/oracle';
DROP DATABASE LINK remote;
CREATE DATABASE LINK remote CONNECT TO tk_opha IDENTIFIED BY ${acual_password} USING '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(Host=localhost)(Port=1525))(CONNECT_DATA=(SID=${acual_sid})))';" | sqlplus /nolog

ssh -o ExitOnForwardFailure=yes -o StrictHostKeyChecking=no -f -N -J ${username}@melkinpaasi.cs.helsinki.fi -L 1525:svm-1.cs.helsinki.fi:1521 ${username}@kurki.cs.helsinki.fi

impdp ${dev_user}/${dev_password}@${dev_sid} network_link=remote directory=my_data logfile=imported.log
