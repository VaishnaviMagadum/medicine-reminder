package com.medreminder.config;

import com.medreminder.model.Medicine;
import com.medreminder.model.User;
import com.medreminder.repository.MedicineRepository;
import com.medreminder.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Data already exists
        }

        System.out.println(">>> Initializing SQL Database with Demo Data...");

        // 1. Create Demo User
        User demoUser = new User("demo", passwordEncoder.encode("demo123"), "user");
        userRepository.save(demoUser);

        // 2. Create Admin User
        User adminUser = new User("admin", passwordEncoder.encode("adminpassword"), "admin");
        userRepository.save(adminUser);

        // 3. Create Sample Medicines for Demo User
        Medicine med1 = new Medicine();
        med1.setName("Amoxicillin");
        med1.setDosage("500mg");
        med1.setReminderTime("08:00");
        med1.setMealType("after food");
        med1.setQuantity(12);
        med1.setTotalQuantity(30);
        med1.setDoctorEmail("dr.smith@example.com");
        med1.setUser(demoUser);
        med1.setCreatedAt(LocalDateTime.now());

        Medicine med2 = new Medicine();
        med2.setName("Lisinopril");
        med2.setDosage("10mg");
        med2.setReminderTime("12:00");
        med2.setMealType("before food");
        med2.setQuantity(25);
        med2.setTotalQuantity(30);
        med2.setDoctorEmail("dr.jones@example.com");
        med2.setUser(demoUser);
        med2.setCreatedAt(LocalDateTime.now());

        Medicine med3 = new Medicine();
        med3.setName("Metformin");
        med3.setDosage("500mg");
        med3.setReminderTime("20:00");
        med3.setMealType("after food");
        med3.setQuantity(4);
        med3.setTotalQuantity(60);
        med3.setDoctorEmail("dr.taylor@example.com");
        med3.setUser(demoUser);
        med3.setCreatedAt(LocalDateTime.now());

        Medicine med4 = new Medicine();
        med4.setName("Vitamin D3");
        med4.setDosage("2000 IU");
        med4.setReminderTime("09:30");
        med4.setMealType("after food");
        med4.setQuantity(50);
        med4.setTotalQuantity(100);
        med4.setDoctorEmail("general@clinic.com");
        med4.setUser(demoUser);
        med4.setCreatedAt(LocalDateTime.now());

        medicineRepository.saveAll(Arrays.asList(med1, med2, med3, med4));
        System.out.println(">>> Demo users & medicines seeded successfully into SQL Database!");
    }
}
