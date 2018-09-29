# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 127.0.0.1 (MySQL 5.6.21)
# Name: wordsZapas
# Date: 2017-01-14 20:30:00 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# Export of table Tenant
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Tenant`;

CREATE TABLE `Tenant` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `imagePath` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `Tenant` WRITE;
/*!40000 ALTER TABLE `Tenant` DISABLE KEYS */;

INSERT INTO `Tenant` (`id`, `name`, `imagePath`, `createdAt`, `updatedAt`)
VALUES
  (1,'Stage','',NOW(),NOW());

/*!40000 ALTER TABLE `Tenant` ENABLE KEYS */;
UNLOCK TABLES;

# Export of table User
# ------------------------------------------------------------

DROP TABLE IF EXISTS `User`;

CREATE TABLE `User` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `referral` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `confirmedEmail` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;

INSERT INTO `User` (`id`, `firstName`, `lastName`, `email`, `password`, `location`, `referral`, `createdAt`, `updatedAt`, `confirmedEmail`)
VALUES
  (1,'Sergiy','Ryabokon','sorgr2014@gmail.com','$2a$10$Z6rYapjZIIJH8/cni4egH.sLybdI1N51MCxEAZQf1V8vYdd.0s9eS',NULL,NULL,NOW(),NOW(),1),
  (2,'Lilya','Ryabokon','sorg1@i.ua','$2a$10$Z6rYapjZIIJH8/cni4egH.sLybdI1N51MCxEAZQf1V8vYdd.0s9eS',NULL,NULL,NOW(),NOW(),1);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;


# Export of table Token
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Token`;

CREATE TABLE `Token` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(255) DEFAULT NULL,
  `expiresAt` datetime DEFAULT NULL,
  `type` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `data` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `sessions` (
  `session_id` varchar(255) COLLATE utf8_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text COLLATE utf8_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
