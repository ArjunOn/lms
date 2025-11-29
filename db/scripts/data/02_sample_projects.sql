-- Sample Projects Data
INSERT INTO projects (name, description, start_date, end_date) VALUES
('Kitchen Renovation', 'Complete kitchen remodel with new cabinets and appliances', '2025-12-01', '2025-12-31'),
('Office Building Construction', 'New 3-story office building', '2026-01-15', '2026-06-30'),
('Home Electrical Upgrade', 'Upgrade electrical panel and wiring', '2025-12-10', '2025-12-20');

-- Link projects with required skills
INSERT INTO project_required_skills (project_id, skill_id) VALUES
(1, 1), -- Kitchen Renovation needs Carpentry
(1, 2), -- Kitchen Renovation needs Plumbing
(1, 3), -- Kitchen Renovation needs Electrical
(2, 1), -- Office Building needs Carpentry
(2, 5), -- Office Building needs Masonry
(2, 3), -- Office Building needs Electrical
(3, 3); -- Home Electrical needs Electrical
