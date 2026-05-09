package com.smartlogix.envios;

import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableRabbit
public class EnviosApplication {
    public static void main(String[] args) {
        SpringApplication.run(EnviosApplication.class, args);
    }
}