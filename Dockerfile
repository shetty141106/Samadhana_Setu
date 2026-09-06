# Build the Spring Boot application with Java 17 + Maven
FROM maven:3.9.11-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

RUN chmod +x mvnw && ./mvnw dependency:go-offline -DskipTests

COPY src src

RUN ./mvnw clean package -DskipTests

# Run the application with a smaller Java 17 runtime image
FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -jar app.jar"]
