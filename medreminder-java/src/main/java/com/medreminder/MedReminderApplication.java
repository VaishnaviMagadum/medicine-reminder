package com.medreminder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MedReminderApplication {

    public static void main(String[] args) {
        SpringApplication.run(MedReminderApplication.class, args);
        System.out.println("=================================================");
        System.out.println(" MedReminder Java (Spring Boot + SQL) is RUNNING!");
        System.out.println(" Local UI:       http://localhost:8080/");
        System.out.println(" SQL H2 Console: http://localhost:8080/h2-console");
        System.out.println(" Health API:     http://localhost:8080/api/health");
        System.out.println("=================================================");
    }
}

