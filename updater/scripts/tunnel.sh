echo "AD-username:";
read username;
ssh -J $username@melkki.cs.helsinki.fi -L 1521:svm-1.cs.helsinki.fi:1521 $username@kurki.cs.helsinki.fi;