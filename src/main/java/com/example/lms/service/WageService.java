package com.example.lms.service;

import com.example.lms.entity.Assignment;
import com.example.lms.entity.Wage;
import com.example.lms.repository.WageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class WageService {
    @Autowired
    private WageRepository wageRepository;

    public Wage calculateAndSaveWage(Assignment assignment, Double hoursWorked, LocalDate date) {
        Double hourlyRate = assignment.getLabour().getHourlyRate();
        Double calculatedWage = hourlyRate * hoursWorked;

        Wage wage = new Wage();
        wage.setAssignment(assignment);
        wage.setHoursWorked(hoursWorked);
        wage.setDate(date);
        wage.setCalculatedWage(calculatedWage);

        return wageRepository.save(wage);
    }

    public List<Wage> getWagesByAssignment(Long assignmentId) {
        return wageRepository.findByAssignmentId(assignmentId);
    }
}
