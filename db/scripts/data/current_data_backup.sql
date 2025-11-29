-- MySQL dump 10.13  Distrib 9.5.0, for macos15.7 (arm64)
--
-- Host: localhost    Database: lms_db
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '263301a0-cbb0-11f0-b893-3218e01df05b:1-40';

--
-- Dumping data for table `assignments`
--

LOCK TABLES `assignments` WRITE;
/*!40000 ALTER TABLE `assignments` DISABLE KEYS */;
INSERT INTO `assignments` VALUES (1,NULL,'2025-11-27','ACTIVE',1,1),(2,NULL,'2025-11-29','ACTIVE',2,2),(3,NULL,'2025-11-29','ACTIVE',2,2),(4,NULL,'2025-11-29','ACTIVE',2,2),(5,NULL,'2025-11-29','ACTIVE',2,2),(6,NULL,'2025-11-29','ACTIVE',2,2),(7,NULL,'2025-11-29','ACTIVE',2,2);
/*!40000 ALTER TABLE `assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `labour_skills`
--

LOCK TABLES `labour_skills` WRITE;
/*!40000 ALTER TABLE `labour_skills` DISABLE KEYS */;
INSERT INTO `labour_skills` VALUES (1,1),(2,2),(2,3);
/*!40000 ALTER TABLE `labour_skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `labours`
--

LOCK TABLES `labours` WRITE;
/*!40000 ALTER TABLE `labours` DISABLE KEYS */;
INSERT INTO `labours` VALUES (1,'555-0100',25,'John Doe'),(2,'9493721465',2,'mannem venkatesh');
/*!40000 ALTER TABLE `labours` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `project_required_skills`
--

LOCK TABLES `project_required_skills` WRITE;
/*!40000 ALTER TABLE `project_required_skills` DISABLE KEYS */;
INSERT INTO `project_required_skills` VALUES (1,1),(2,2),(1,4);
/*!40000 ALTER TABLE `project_required_skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,'Fixing pipes',NULL,'Bathroom Reno',NULL),(2,'There is three acres of ripen mirchi to be harvested in chinthapalli and it is 3 kms from the village','2025-12-02','mirchi harvesting','2025-11-29');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ratings`
--

LOCK TABLES `ratings` WRITE;
/*!40000 ALTER TABLE `ratings` DISABLE KEYS */;
/*!40000 ALTER TABLE `ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `skills`
--

LOCK TABLES `skills` WRITE;
/*!40000 ALTER TABLE `skills` DISABLE KEYS */;
INSERT INTO `skills` VALUES (3,'agriculture works'),(4,'Electrical'),(2,'harvesting'),(1,'Plumbing');
/*!40000 ALTER TABLE `skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `wages`
--

LOCK TABLES `wages` WRITE;
/*!40000 ALTER TABLE `wages` DISABLE KEYS */;
/*!40000 ALTER TABLE `wages` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-29 11:30:11
