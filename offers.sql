ALTER TABLE `offers` ADD FOREIGN KEY (`user`) REFERENCES `accounts` (`id`);
ALTER TABLE `offers` ADD FOREIGN KEY (`item`) REFERENCES `items` (`item_id`);