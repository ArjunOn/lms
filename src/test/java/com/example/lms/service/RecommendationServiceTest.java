package com.example.lms.service;

import com.example.lms.entity.Labour;
import com.example.lms.entity.Rating;
import com.example.lms.entity.Skill;
import com.example.lms.repository.LabourRepository;
import com.example.lms.repository.RatingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class RecommendationServiceTest {

    @Mock
    private LabourRepository labourRepository;

    @Mock
    private RatingRepository ratingRepository;

    @InjectMocks
    private RecommendationService recommendationService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testRecommendLabours() {
        // Setup Skills
        Skill plumbing = new Skill();
        plumbing.setName("Plumbing");
        Skill electric = new Skill();
        electric.setName("Electric");

        // Setup Labours
        Labour l1 = new Labour();
        l1.setId(1L);
        l1.setName("L1");
        l1.setSkills(new HashSet<>(Collections.singletonList(plumbing)));

        Labour l2 = new Labour();
        l2.setId(2L);
        l2.setName("L2");
        l2.setSkills(new HashSet<>(Arrays.asList(plumbing, electric)));

        Labour l3 = new Labour();
        l3.setId(3L);
        l3.setName("L3");
        l3.setSkills(new HashSet<>(Collections.singletonList(electric)));

        when(labourRepository.findAll()).thenReturn(Arrays.asList(l1, l2, l3));

        // Setup Ratings
        Rating r1 = new Rating();
        r1.setScore(5);
        when(ratingRepository.findByLabourId(1L)).thenReturn(Collections.singletonList(r1));

        Rating r2 = new Rating();
        r2.setScore(3);
        when(ratingRepository.findByLabourId(2L)).thenReturn(Collections.singletonList(r2));

        // Test Case 1: Require Plumbing
        List<Labour> result = recommendationService.recommendLabours(Collections.singletonList("Plumbing"));
        // L1 and L2 have Plumbing. L1 has rating 5, L2 has rating 3.
        // Should return [L1, L2]
        assertEquals(2, result.size());
        assertEquals("L1", result.get(0).getName());
        assertEquals("L2", result.get(1).getName());
    }
}
