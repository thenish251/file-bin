CREATE SCHEMA IF NOT EXISTS `filebin`;

USE filebin;

 CREATE TABLE IF NOT EXISTS `filebin`.`uploaded_data`(
    `id`            INT          NOT NULL AUTO_INCREMENT,
    `file_name`     VARCHAR(255) NOT NULL,
    `url_key`       VARCHAR(255) NOT NULL,
    `uploaded_at`   DATETIME     NOT NULL,
    `downloaded_at` DATETIME     NULL,
    PRIMARY KEY (`id`));