package com.example.lms.service;

import com.example.lms.entity.Labour;
import com.example.lms.entity.Skill;
import com.example.lms.repository.LabourRepository;
import com.example.lms.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class LabourService {
    @Autowired
    private LabourRepository labourRepository;

    @Autowired
    private SkillRepository skillRepository;

    public List<Labour> getAllLabours() {
        return labourRepository.findAll();
    }

    public Optional<Labour> getLabourById(Long id) {
        return labourRepository.findById(id);
    }

    public Labour saveLabour(Labour labour) {
        // Process skills - find existing or create new
        if (labour.getSkills() != null && !labour.getSkills().isEmpty()) {
            Set<Skill> processedSkills = new HashSet<>();
            for (Skill skill : labour.getSkills()) {
                Skill existingSkill = skillRepository.findByName(skill.getName())
                        .orElseGet(() -> {
                            Skill newSkill = new Skill();
                            newSkill.setName(skill.getName());
                            return skillRepository.save(newSkill);
                        });
                processedSkills.add(existingSkill);
            }
            labour.setSkills(processedSkills);
        }
        return labourRepository.save(labour);
    }

    public Labour addSkillToLabour(Long labourId, String skillName) {
        Labour labour = labourRepository.findById(labourId).orElseThrow(() -> new RuntimeException("Labour not found"));
        Skill skill = skillRepository.findByName(skillName)
                .orElseGet(() -> {
                    Skill newSkill = new Skill();
                    newSkill.setName(skillName);
                    return skillRepository.save(newSkill);
                });

        if (labour.getSkills() == null) {
            labour.setSkills(new HashSet<>());
        }
        labour.getSkills().add(skill);
        return labourRepository.save(labour);
    }

    public void deleteLabour(Long id) {
        labourRepository.deleteById(id);
    }
}
