package com.medreminder.controller;

import com.medreminder.dto.AdminStatsResponse;
import com.medreminder.model.Medicine;
import com.medreminder.model.User;
import com.medreminder.repository.MedicineRepository;
import com.medreminder.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    private final Random random = new Random();

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        long totalUsers = userRepository.count();
        long activeMeds = medicineRepository.count();
        int alertsToday = random.nextInt(15) + 1;

        return ResponseEntity.ok(new AdminStatsResponse(totalUsers, activeMeds, alertsToday, "Healthy"));
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/medicines")
    public ResponseEntity<List<Medicine>> getAllMedicines() {
        return ResponseEntity.ok(medicineRepository.findAll());
    }
}
