package com.example.lms.rest;

import com.example.lms.entity.Labour;
import com.example.lms.service.LabourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/labours")
public class LabourRestController {

    @Autowired
    private LabourService labourService;

    @GetMapping
    public ResponseEntity<List<Labour>> getAllLabours() {
        return ResponseEntity.ok(labourService.getAllLabours());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Labour> getLabourById(@PathVariable Long id) {
        return labourService.getLabourById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Labour> createLabour(@RequestBody Labour labour) {
        Labour saved = labourService.saveLabour(labour);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Labour> updateLabour(@PathVariable Long id, @RequestBody Labour labour) {
        labour.setId(id);
        Labour updated = labourService.saveLabour(labour);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLabour(@PathVariable Long id) {
        labourService.deleteLabour(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/skills")
    public ResponseEntity<Labour> addSkill(@PathVariable Long id, @RequestParam String skillName) {
        Labour updated = labourService.addSkillToLabour(id, skillName);
        return ResponseEntity.ok(updated);
    }
}
