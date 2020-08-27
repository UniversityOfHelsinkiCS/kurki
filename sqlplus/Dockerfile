FROM ubuntu

RUN apt-get -y update && apt-get -y install wget unzip rlwrap libaio1 openssh-client && \
    wget https://download.oracle.com/otn_software/linux/instantclient/19800/instantclient-basic-linux.x64-19.8.0.0.0dbru.zip && \
    wget https://download.oracle.com/otn_software/linux/instantclient/19800/instantclient-sqlplus-linux.x64-19.8.0.0.0dbru.zip

RUN unzip instantclient-sqlplus-linux.x64-19.8.0.0.0dbru.zip && unzip instantclient-basic-linux.x64-19.8.0.0.0dbru.zip

ENV LD_LIBRARY_PATH /instantclient_19_8

CMD ssh -o ExitOnForwardFailure=yes -o StrictHostKeyChecking=no -f -N -J $USER@melkinpaasi.cs.helsinki.fi -L 1521:svm-1.cs.helsinki.fi:1521 $USER@kurki.cs.helsinki.fi; sleep 0.5; rlwrap /instantclient_19_8/sqlplus "tk_opha@(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(Host=localhost)(Port=1521))(CONNECT_DATA=(SID=ope)))"