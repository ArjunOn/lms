package com.example.lms.service;

import com.example.lms.entity.*;
import com.example.lms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProjectCostService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private WageRepository wageRepository;

    public Map<String, Object> calculateProjectCost(Long projectId) {
        Map<String, Object> costSummary = new HashMap<>();

        // Get all assignments for the project
        List<Assignment> assignments = assignmentRepository.findByProjectId(projectId);

        // Calculate total wages
        List<Wage> wages = wageRepository.findByAssignment_ProjectId(projectId);
        double totalWages = wages.stream()
                .mapToDouble(w -> w.getTotalAmount() != null ? w.getTotalAmount() : 0.0)
                .sum();

        // Calculate estimated cost based on active assignments
        double estimatedCost = 0.0;
        for (Assignment assignment : assignments) {
            if ("ACTIVE".equals(assignment.getStatus())) {
                // Estimate 30 days of work at 8 hours per day
                double hourlyRate = assignment.getLabour().getHourlyRate();
                estimatedCost += (30 * 8 * hourlyRate);
            }
        }

        costSummary.put("totalWages", totalWages);
        costSummary.put("estimatedCost", estimatedCost);
        costSummary.put("assignmentCount", assignments.size());
        costSummary.put("activeAssignments", assignments.stream()
                .filter(a -> "ACTIVE".equals(a.getStatus()))
                .count());

        return costSummary;
    }

    public Map<String, Object> getBudgetAnalysis(Long projectId, Double budget) {
        Map<String, Object> analysis = new HashMap<>();
        Map<String, Object> costSummary = calculateProjectCost(projectId);

        double totalWages = (Double) costSummary.get("totalWages");
        double estimatedCost = (Double) costSummary.get("estimatedCost");

        analysis.put("budget", budget);
        analysis.put("actualCost", totalWages);
        analysis.put("estimatedTotalCost", estimatedCost);
        analysis.put("remainingBudget", budget - totalWages);
        analysis.put("projectedOverrun", estimatedCost - budget);
        analysis.put("percentageUsed", budget > 0 ? (totalWages / budget) * 100 : 0);

        return analysis;
    }
}
