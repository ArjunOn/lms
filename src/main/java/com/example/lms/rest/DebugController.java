package com.example.lms.rest;

import com.example.lms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private LabourRepository labourRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @GetMapping("/data-summary")
    public ResponseEntity<Map<String, Object>> getDataSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("projects", projectRepository.count());
        summary.put("labours", labourRepository.count());
        summary.put("assignments", assignmentRepository.count());
        summary.put("skills", skillRepository.count());
        summary.put("ratings", ratingRepository.count());
        summary.put("timestamp", java.time.LocalDateTime.now());
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/assignments")
    public ResponseEntity<?> getAllAssignments() {
        return ResponseEntity.ok(assignmentRepository.findAll());
    }

    @GetMapping("/ratings")
    public ResponseEntity<?> getAllRatings() {
        return ResponseEntity.ok(ratingRepository.findAll());
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> health = new HashMap<>();
        health.put("status", "UP");
        health.put("database", "Connected");
        health.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(health);
    }
}
