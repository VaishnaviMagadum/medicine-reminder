package com.medreminder.repository;

import com.medreminder.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    @Query("SELECT m FROM Medicine m WHERE m.user.id = :userId ORDER BY m.createdAt DESC")
    List<Medicine> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    @Query("SELECT m FROM Medicine m WHERE m.id = :id AND m.user.id = :userId")
    Optional<Medicine> findByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);

    @Query("SELECT COUNT(m) FROM Medicine m WHERE m.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
}

