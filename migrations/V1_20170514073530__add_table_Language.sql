CREATE TABLE `Language` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(10) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO `Language` (`code`, `name`, `createdAt`, `updatedAt`) VALUES ('en', 'English', now(), now());
INSERT INTO `Language` (`code`, `name`, `createdAt`, `updatedAt`) VALUES ('ua', 'Українська', now(), now());
INSERT INTO `Language` (`code`, `name`, `createdAt`, `updatedAt`) VALUES ('ru', 'Русский', now(), now());
ALTER TABLE `User`
	ADD COLUMN `LanguageId` INT(11) NOT NULL DEFAULT 1;
