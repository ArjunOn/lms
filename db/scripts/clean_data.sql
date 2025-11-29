-- Clean all data from tables (keeps schema intact)
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE ratings;
TRUNCATE TABLE assignments;
TRUNCATE TABLE wages;
TRUNCATE TABLE labour_skills;
TRUNCATE TABLE project_required_skills;
TRUNCATE TABLE labours;
TRUNCATE TABLE projects;
TRUNCATE TABLE skills;

SET FOREIGN_KEY_CHECKS = 1;
