-- Sample Labours Data
INSERT INTO labours (name, contact_number, hourly_rate) VALUES
('John Smith', '555-0101', 35.00),
('Maria Garcia', '555-0102', 40.00),
('David Chen', '555-0103', 45.00),
('Sarah Johnson', '555-0104', 38.00),
('Michael Brown', '555-0105', 42.00);

-- Link labours with their skills
INSERT INTO labour_skills (labour_id, skill_id) VALUES
(1, 1), -- John Smith - Carpentry
(1, 4), -- John Smith - Painting
(2, 2), -- Maria Garcia - Plumbing
(2, 7), -- Maria Garcia - HVAC
(3, 3), -- David Chen - Electrical
(4, 1), -- Sarah Johnson - Carpentry
(4, 8), -- Sarah Johnson - Roofing
(5, 5), -- Michael Brown - Masonry
(5, 6); -- Michael Brown - Welding
