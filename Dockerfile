FROM maven:3-jdk-7 as build-stage

WORKDIR /usr/app
COPY . .

RUN mvn install:install-file -Dfile=lib/ojdbc7-12.1.0.jar -DgroupId=com.oracle -DartifactId=ojdbc7 -Dversion=12.1.0 -Dpackaging=jar
RUN mvn clean install

FROM tomcat:8.0

# RUN rm -rf /usr/local/tomcat/webapps/*

COPY --from=build-stage /usr/app/target/kurki13-1.0-SNAPSHOT.war /usr/local/tomcat/webapps/kurki.war
