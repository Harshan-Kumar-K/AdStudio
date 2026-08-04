@echo off
REM Start all backend services in sequence

REM 1. Start Eureka Server
start "eurekaServer" cmd /k "cd eurekaServer && mvnw spring-boot:run"

REM Wait ~38 seconds so that Eureka Server is up and running before starting other services
REM if this time gap not exist then other services like advertiser, iam will get error while registering with Eureka Server
ping 127.0.0.1 -n 38 >nul

REM 2-8. Start all other services
start "advertiser" cmd /k "cd advertiser && mvnw spring-boot:run"
start "iam" cmd /k "cd iam && mvnw spring-boot:run"
start "creative" cmd /k "cd creative && mvnw spring-boot:run"
start "delivery" cmd /k "cd delivery && mvnw spring-boot:run"
start "finance" cmd /k "cd finance && mvnw spring-boot:run"
start "mediaplan" cmd /k "cd mediaplan && mvnw spring-boot:run"
start "notification" cmd /k "cd notification && mvnw spring-boot:run"

REM Wait ~35 seconds before starting Gateway
ping 127.0.0.1 -n 35 >nul

REM 9. Start API Gateway
start "apiGateway" cmd /k "cd apiGateway && mvnw spring-boot:run"