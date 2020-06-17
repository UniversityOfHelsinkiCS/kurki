#!/bin/bash

echo "AD-username:";
read username;
docker exec -it kurki-db ssh -J $username@melkki.cs.helsinki.fi -L 1525:svm-1.cs.helsinki.fi:1521 $username@kurki.cs.helsinki.fi;