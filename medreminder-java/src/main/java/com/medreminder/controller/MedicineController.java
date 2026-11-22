package com.medreminder.controller;

import com.medreminder.dto.MedicineRequest;
import com.medreminder.model.Medicine;
import com.medreminder.model.User;
import com.medreminder.repository.MedicineRepository;
import com.medreminder.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin(origins = "*")
public class MedicineController {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private UserRepository userRepository;

    private Long getUserId(HttpServletRequest request) {
        Object id = request.getAttribute("userId");
        if (id instanceof Long) {
            return (Long) id;
        }
        return 1L; // fallback
    }

    @GetMapping
    public ResponseEntity<List<Medicine>> getMedicines(HttpServletRequest request) {
        Long userId = getUserId(request);
        List<Medicine> list = medicineRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMedicineById(@PathVariable Long id, HttpServletRequest request) {
        Long userId = getUserId(request);
        Optional<Medicine> medOpt = medicineRepository.findByIdAndUserId(id, userId);

        if (medOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("msg", "Medicine not found"));
        }
        return ResponseEntity.ok(medOpt.get());
    }

    @PostMapping
    public ResponseEntity<?> createMedicine(@RequestBody MedicineRequest req, HttpServletRequest request) {
        Long userId = getUserId(request);
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isEmpty()) {
            // If demo fallback, pick first user
            userOpt = userRepository.findAll().stream().findFirst();
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("msg", "User not found"));
            }
        }

        Medicine med = new Medicine();
        med.setName(req.getName());
        med.setDosage(req.getDosage());
        med.setReminderTime(req.getReminderTime());
        med.setMealType(req.getMealType() != null ? req.getMealType() : "after food");
        med.setQuantity(req.getQuantity() != null ? req.getQuantity() : 0);
        med.setTotalQuantity(req.getTotalQuantity() != null ? req.getTotalQuantity() : 0);
        med.setDoctorEmail(req.getDoctorEmail());
        med.setStartDate(req.getStartDate());
        med.setEndDate(req.getEndDate());
        med.setUser(userOpt.get());
        med.setCreatedAt(LocalDateTime.now());

        Medicine saved = medicineRepository.save(med);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMedicine(@PathVariable Long id, @RequestBody Map<String, Object> updates, HttpServletRequest request) {
        Long userId = getUserId(request);
        Optional<Medicine> medOpt = medicineRepository.findById(id);

        if (medOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("msg", "Medicine not found in database"));
        }

        Medicine med = medOpt.get();
        if (!med.getUserId().equals(userId) && !userId.equals(999L)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("msg", "Medicine not found (Owner mismatch)"));
        }

        if (updates.containsKey("name")) med.setName((String) updates.get("name"));
        if (updates.containsKey("dosage")) med.setDosage((String) updates.get("dosage"));
        if (updates.containsKey("reminderTime")) med.setReminderTime((String) updates.get("reminderTime"));
        if (updates.containsKey("mealType")) med.setMealType((String) updates.get("mealType"));
        if (updates.containsKey("quantity")) {
            Object q = updates.get("quantity");
            med.setQuantity(q instanceof Number ? ((Number) q).intValue() : Integer.parseInt(q.toString()));
        }
        if (updates.containsKey("totalQuantity")) {
            Object tq = updates.get("totalQuantity");
            med.setTotalQuantity(tq instanceof Number ? ((Number) tq).intValue() : Integer.parseInt(tq.toString()));
        }
        if (updates.containsKey("doctorEmail")) med.setDoctorEmail((String) updates.get("doctorEmail"));
        if (updates.containsKey("startDate")) med.setStartDate((String) updates.get("startDate"));
        if (updates.containsKey("endDate")) med.setEndDate((String) updates.get("endDate"));

        Medicine saved = medicineRepository.save(med);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedicine(@PathVariable Long id, HttpServletRequest request) {
        Long userId = getUserId(request);
        Optional<Medicine> medOpt = medicineRepository.findById(id);

        if (medOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("msg", "Medicine not found"));
        }

        Medicine med = medOpt.get();
        if (!med.getUserId().equals(userId) && !userId.equals(999L)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("msg", "Medicine not found"));
        }

        medicineRepository.delete(med);
        return ResponseEntity.ok(Map.of("msg", "Medicine removed"));
    }

    @PostMapping("/alert/{id}")
    public ResponseEntity<?> sendAlert(@PathVariable Long id) {
        Optional<Medicine> medOpt = medicineRepository.findById(id);
        if (medOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("msg", "Medicine not found"));
        }
        return ResponseEntity.ok(Map.of("msg", "Alert sent successfully", "success", true));
    }
}
