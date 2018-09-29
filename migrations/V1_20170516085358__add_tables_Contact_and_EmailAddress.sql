CREATE TABLE `Contact` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`firstName` varchar(255) NOT NULL,
	`lastName` varchar(255) NOT NULL,
	`EmailAddressId` int(11) NOT NULL,
	`TenantId` int(11) NOT NULL,
	`UserId` int(11) NULL,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `EmailAddress` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`email` varchar(255) NOT NULL,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	`blocked` tinyint(1) NOT NULL DEFAULT false,
	PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `User`
	ADD COLUMN `EmailAddressId` int(11) AFTER `email`
	, ADD CONSTRAINT `fk_user_email` FOREIGN KEY (`EmailAddressId`) REFERENCES `EmailAddress`(`id`);
INSERT INTO `EmailAddress` (`email`, `createdAt`, `updatedAt`, `blocked`)
SELECT u.email
	, NOW()
	, NOW()
	, false
FROM `User` as u;
UPDATE `User` AS u
	INNER JOIN `EmailAddress` AS e
		ON u.email = e.email SET u.EmailAddressId = e.id  
WHERE
	u.email IS NOT NULL;
ALTER TABLE `User`
	DROP COLUMN `email`;
