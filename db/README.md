# Database Scripts

This folder contains all database-related scripts for the Labour Management System (LMS).

## Folder Structure

```
db/scripts/
├── schema/          # DDL scripts (table definitions)
├── data/            # DML scripts (sample/test data)
├── procedures/      # Stored procedures (if any)
├── clean_data.sql   # Clean all data (keeps schema)
└── reset_database.sql # Complete database reset
```

## Usage

### 1. Export Current Schema
```bash
mysqldump -u root --no-data --skip-add-drop-table lms_db > db/scripts/schema/01_create_tables.sql
```

### 2. Clean Database (Remove Data Only)
```bash
mysql -u root lms_db < db/scripts/clean_data.sql
```

### 3. Load Sample Data
```bash
cd db/scripts
mysql -u root lms_db < data/01_sample_skills.sql
mysql -u root lms_db < data/02_sample_projects.sql
mysql -u root lms_db < data/03_sample_labours.sql
mysql -u root lms_db < data/04_sample_assignments.sql
mysql -u root lms_db < data/05_sample_ratings.sql
```

### 4. Complete Database Reset
```bash
cd db/scripts
mysql -u root < reset_database.sql
```

## Database Tables

- **projects** - Project information
- **labours** - Labour/worker information
- **skills** - Available skills
- **assignments** - Project-labour assignments
- **ratings** - Labour performance ratings
- **wages** - Wage calculations
- **labour_skills** - Many-to-many: labour skills
- **project_required_skills** - Many-to-many: project required skills

## Debug Endpoints

Use these endpoints to inspect database state:

- `GET /api/debug/data-summary` - Count of all entities
- `GET /api/debug/assignments` - All assignments with details
- `GET /api/debug/ratings` - All ratings
- `GET /api/debug/health` - System health check

## Best Practices

1. **Version Control**: Keep all DDL/DML scripts in version control
2. **Backup First**: Always backup before running reset scripts
3. **Test Data**: Use sample data scripts for development/testing
4. **Documentation**: Update this README when adding new scripts
