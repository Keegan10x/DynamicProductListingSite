CREATE TABLE IF NOT EXISTS `accounts` (
  `id` mediumint UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  `user` varchar(25),
  `pass` varchar(70)
);

CREATE TABLE IF NOT EXISTS `items` (
  `userid` mediumint UNSIGNED,
  `item_id` mediumint UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  `item_name` varchar(30),
  `image` varchar(50),
  `description` varchar(150),
  `price` mediumint UNSIGNED,
  `added` datetime,
  `for_sale` boolean
);

ALTER TABLE `items` ADD FOREIGN KEY (`userid`) REFERENCES `accounts` (`id`);
