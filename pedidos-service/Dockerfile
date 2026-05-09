FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY target/pedidos-service-1.0.0.jar /app.jar
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*
ENTRYPOINT ["sh","-c","until nc -z mysql 3306; do echo waiting for mysql; sleep 2; done; java -jar /app.jar"]