package com.example.lms.repository;

import com.example.lms.entity.Wage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WageRepository extends JpaRepository<Wage, Long> {
    List<Wage> findByAssignmentId(Long assignmentId);
}
