package com.example.lms.rest;

import com.example.lms.entity.*;
import com.example.lms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wages")
public class WageRestController {

    @Autowired
    private WageRepository wageRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @GetMapping
    public ResponseEntity<List<Wage>> getAllWages() {
        return ResponseEntity.ok(wageRepository.findAll());
    }

    @GetMapping("/labour/{labourId}")
    public ResponseEntity<List<Wage>> getWagesByLabour(@PathVariable Long labourId) {
        return ResponseEntity.ok(wageRepository.findByAssignment_LabourId(labourId));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Wage>> getWagesByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(wageRepository.findByAssignment_ProjectId(projectId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Wage>> getWagesByStatus(@PathVariable WageStatus status) {
        return ResponseEntity.ok(wageRepository.findByStatus(status));
    }

    @PostMapping("/calculate")
    public ResponseEntity<?> calculateWage(@RequestBody WageCalculationRequest request) {
        Assignment assignment = assignmentRepository.findById(request.getAssignmentId())
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        // Calculate days worked
        LocalDate startDate = assignment.getStartDate();
        LocalDate endDate = request.getEndDate() != null ? request.getEndDate() : LocalDate.now();
        long daysWorked = ChronoUnit.DAYS.between(startDate, endDate) + 1;

        // Calculate total amount (assuming 8 hours per day)
        double hourlyRate = assignment.getLabour().getHourlyRate();
        double totalAmount = daysWorked * 8 * hourlyRate;

        Wage wage = new Wage();
        wage.setAssignment(assignment);
        wage.setDaysWorked((int) daysWorked);
        wage.setTotalAmount(totalAmount);
        wage.setCalculatedWage(totalAmount);
        wage.setHoursWorked((double) (daysWorked * 8));
        wage.setDate(LocalDate.now());
        wage.setCalculatedDate(LocalDate.now());
        wage.setStatus(WageStatus.PENDING);

        Wage saved = wageRepository.save(wage);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/settle")
    public ResponseEntity<Wage> settleWage(@PathVariable Long id) {
        Wage wage = wageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Wage not found"));

        wage.setStatus(WageStatus.SETTLED);
        wage.setSettledDate(LocalDate.now());

        Wage updated = wageRepository.save(wage);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWage(@PathVariable Long id) {
        wageRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // Inner class for request
    public static class WageCalculationRequest {
        private Long assignmentId;
        private LocalDate endDate;

        public Long getAssignmentId() {
            return assignmentId;
        }

        public void setAssignmentId(Long assignmentId) {
            this.assignmentId = assignmentId;
        }

        public LocalDate getEndDate() {
            return endDate;
        }

        public void setEndDate(LocalDate endDate) {
            this.endDate = endDate;
        }
    }
}
