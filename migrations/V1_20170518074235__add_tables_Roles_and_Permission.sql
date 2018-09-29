CREATE TABLE `Permission` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL,
	`to` varchar(255) NULL,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `Role` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL,
	`description` varchar(255) NULL,
    `TenantId` int(11) NULL,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	PRIMARY KEY (`id`),
    KEY `fk_role_tenant` (`TenantId`),
    CONSTRAINT `fk_role_tenant` FOREIGN KEY (`TenantId`) REFERENCES `Tenant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `RolePermission` (
	`RoleId` int(11) NOT NULL,
	`PermissionId` int(11) NOT NULL,    
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	PRIMARY KEY (`RoleId`,`PermissionId`),
	KEY `fk_rolepermissin_role` (`RoleId`),
	KEY `fk_rolepermissin_permission` (`PermissionId`),
	CONSTRAINT `fk_rolepermissin_role` FOREIGN KEY (`RoleId`) REFERENCES `Role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT `fk_rolepermissin_permission` FOREIGN KEY (`PermissionId`) REFERENCES `Permission` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `UserRole` (	
	`UserId` int(11) NOT NULL,
	`RoleId` int(11) NOT NULL,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	PRIMARY KEY (`UserId`,`RoleId`),
	KEY `fk_userrole_user` (`UserId`),
	KEY `fk_userrole_role` (`RoleId`),
	CONSTRAINT `fk_userrole_user` FOREIGN KEY (`UserId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT `fk_userrole_role` FOREIGN KEY (`RoleId`) REFERENCES `Role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE	
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
LOCK TABLES `Permission` WRITE;
/*!40000 ALTER TABLE `Permission` DISABLE KEYS */;
INSERT INTO `Permission` (`name`, `createdAt`, `updatedAt`) VALUES ('manage', now(), now());
SET @p1=LAST_INSERT_ID();
INSERT INTO `Permission` (`name`, `to`, `createdAt`, `updatedAt`) VALUES ('manageOfTenant', 'Tenant', now(), now());
SET @p2=LAST_INSERT_ID();
INSERT INTO `Permission` (`name`, `to`, `createdAt`, `updatedAt`) VALUES ('usingOfTenant', 'Tenant', now(), now());
SET @p3=LAST_INSERT_ID();
/*!40000 ALTER TABLE `Permission` ENABLE KEYS */;
UNLOCK TABLES;
LOCK TABLES `Role` WRITE;
/*!40000 ALTER TABLE `Role` DISABLE KEYS */;
INSERT INTO `Role` (`name`, `createdAt`, `updatedAt`) VALUES ('superAdmin', now(), now());
SET @r1=LAST_INSERT_ID();
INSERT INTO `Role` (`name`, `createdAt`, `updatedAt`, `TenantId`) VALUES ('adminOfTenant', now(), now(), 1);
SET @r2=LAST_INSERT_ID();
INSERT INTO `Role` (`name`, `createdAt`, `updatedAt`, `TenantId`) VALUES ('clientOfTenant', now(), now(), 1);
SET @r3=LAST_INSERT_ID();
/*!40000 ALTER TABLE `Role` ENABLE KEYS */;
UNLOCK TABLES;
LOCK TABLES `RolePermission` WRITE;
/*!40000 ALTER TABLE `RolePermission` DISABLE KEYS */;
INSERT INTO `RolePermission` (`RoleId`, `PermissionId`, `createdAt`, `updatedAt`) VALUES (@r1, @p1, now(), now());
INSERT INTO `RolePermission` (`RoleId`, `PermissionId`, `createdAt`, `updatedAt`) VALUES (@r2, @p2, now(), now());
INSERT INTO `RolePermission` (`RoleId`, `PermissionId`, `createdAt`, `updatedAt`) VALUES (@r3, @p3, now(), now());
/*!40000 ALTER TABLE `RolePermission` ENABLE KEYS */;
UNLOCK TABLES;
LOCK TABLES `UserRole` WRITE;
/*!40000 ALTER TABLE `UserRole` DISABLE KEYS */;
INSERT INTO `UserRole` (`UserId`, `RoleId`, `createdAt`, `updatedAt`) VALUES (1, @r1, now(), now());
INSERT INTO `UserRole` (`UserId`, `RoleId`, `createdAt`, `updatedAt`) VALUES (1, @r2, now(), now());
INSERT INTO `UserRole` (`UserId`, `RoleId`, `createdAt`, `updatedAt`) VALUES (2, @r2, now(), now());
INSERT INTO `UserRole` (`UserId`, `RoleId`, `createdAt`, `updatedAt`) VALUES (2, @r3, now(), now());
/*!40000 ALTER TABLE `UserRole` ENABLE KEYS */;
UNLOCK TABLES;
