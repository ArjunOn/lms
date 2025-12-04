package com.example.lms.service;

import com.example.lms.entity.Project;
import com.example.lms.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    @Autowired
    private com.example.lms.repository.SkillRepository skillRepository;

    public Project saveProject(Project project) {
        // Process skills - find existing or create new
        if (project.getRequiredSkills() != null && !project.getRequiredSkills().isEmpty()) {
            java.util.Set<com.example.lms.entity.Skill> processedSkills = new java.util.HashSet<>();
            for (com.example.lms.entity.Skill skill : project.getRequiredSkills()) {
                com.example.lms.entity.Skill existingSkill = skillRepository.findByName(skill.getName())
                        .orElseGet(() -> {
                            com.example.lms.entity.Skill newSkill = new com.example.lms.entity.Skill();
                            newSkill.setName(skill.getName());
                            return skillRepository.save(newSkill);
                        });
                processedSkills.add(existingSkill);
            }
            project.setRequiredSkills(processedSkills);
        }
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    public void addSkillToProject(Long projectId, String skillName) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        com.example.lms.entity.Skill skill = skillRepository.findByName(skillName)
                .orElseGet(() -> {
                    com.example.lms.entity.Skill newSkill = new com.example.lms.entity.Skill();
                    newSkill.setName(skillName);
                    return skillRepository.save(newSkill);
                });

        if (project.getRequiredSkills() == null) {
            project.setRequiredSkills(new java.util.HashSet<>());
        }
        project.getRequiredSkills().add(skill);
        projectRepository.save(project);
    }
}
