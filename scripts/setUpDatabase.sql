CREATE DATABASE IF NOT EXISTS simple_board_test CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

CREATE USER IF NOT EXISTS 'simple_board_test'@'localhost' IDENTIFIED by 'Mm6SkgR7wFl42s$I';
GRANT ALL PRIVILEGES ON simple_board_test.* to 'simple_board_test'@'localhost';

CREATE DATABASE IF NOT EXISTS simple_board_local CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

CREATE USER IF NOT EXISTS 'simple_board_local'@'localhost' IDENTIFIED by 'sQa%UNffrRxsbOVc';
GRANT ALL PRIVILEGES ON simple_board_local.* to 'simple_board_local'@'localhost';
