CREATE TABLE `Email` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `to` VARCHAR(255) NOT NULL,
  `fromName` VARCHAR(255) NOT NULL,
  `fromEmail` VARCHAR(255) NOT NULL,
  `subject` TINYTEXT NOT NULL,
  `message` MEDIUMTEXT NOT NULL,
  `headers` MEDIUMTEXT NULL,
  `vars` MEDIUMTEXT NULL,
  `processedAt` DATETIME NULL,
  `attachments` MEDIUMTEXT NULL,
  `messageId` VARCHAR(255) NULL,
  `event` VARCHAR(10) NULL,
  `TenantId` INT(11) NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_email_tenant_idx` (`TenantId` ASC),
  CONSTRAINT `fk_email_tenant`
    FOREIGN KEY (`TenantId`)
    REFERENCES `Tenant` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
