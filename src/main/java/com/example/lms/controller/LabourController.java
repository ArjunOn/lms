package com.example.lms.controller;

import com.example.lms.entity.Labour;
import com.example.lms.service.LabourService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/labours")
public class LabourController {

    @Autowired
    private LabourService labourService;

    @GetMapping
    public String listLabours(Model model) {
        model.addAttribute("labours", labourService.getAllLabours());
        return "labours/list";
    }

    @GetMapping("/create")
    public String showCreateForm(Model model) {
        model.addAttribute("labour", new Labour());
        return "labours/create";
    }

    @PostMapping("/create")
    public String createLabour(@Valid @ModelAttribute Labour labour, BindingResult result) {
        if (result.hasErrors()) {
            return "labours/create";
        }
        labourService.saveLabour(labour);
        return "redirect:/labours";
    }

    @PostMapping("/{id}/skills")
    public String addSkill(@PathVariable Long id, @RequestParam String skillName) {
        labourService.addSkillToLabour(id, skillName);
        return "redirect:/labours"; // Simplified redirect
    }
}
