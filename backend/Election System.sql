CREATE TABLE `Users` (
  `user_id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255),
  `email` VARCHAR(100) UNIQUE NOT NULL -- Added UNIQUE constraint and NOT NULL
  'is_admin' TINYINT(1) NOT NULL
);

CREATE TABLE `Elections` (
  `election_id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL, -- Added NOT NULL
  `start_date` DATE NOT NULL, -- Added NOT NULL
  `end_date` DATE NOT NULL -- Added NOT NULL
);

CREATE TABLE `Positions` (
  `position_id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL, -- Added NOT NULL
  `description` TEXT
);

CREATE TABLE `Candidates` (
  `candidate_id` INT PRIMARY KEY AUTO_INCREMENT,
  `student_id` INT,
  `election_id` INT,
  `essay` VARCHAR(3500),
  `position_id` INT,
  FOREIGN KEY (`student_id`) REFERENCES `Users` (`user_id`),
  FOREIGN KEY (`election_id`) REFERENCES `Elections` (`election_id`),
  FOREIGN KEY (`position_id`) REFERENCES `Positions` (`position_id`),
  UNIQUE (`student_id`, `election_id`, `position_id`) 
);

CREATE TABLE `Votes` (
  `vote_id` INT PRIMARY KEY AUTO_INCREMENT,
  `election_id` INT,
  `voter_id` INT,
  `candidate_id` INT,
  `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`election_id`) REFERENCES `Elections` (`election_id`),
  FOREIGN KEY (`voter_id`) REFERENCES `Users` (`user_id`),
  FOREIGN KEY (`candidate_id`) REFERENCES `Candidates` (`candidate_id`)
);

CREATE TABLE `EligibleVoters` (
  `eligible_voter_id` INT PRIMARY KEY AUTO_INCREMENT,
  `election_id` INT,
  `student_id` INT,
  FOREIGN KEY (`election_id`) REFERENCES `Elections` (`election_id`),
  FOREIGN KEY (`student_id`) REFERENCES `Users` (`user_id`)
);

CREATE TABLE `Groups` (
  `group_id` INT PRIMARY KEY AUTO_INCREMENT,
  `group_name` VARCHAR(255) NOT NULL 
);

CREATE TABLE `Group_Members` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `group_id` INT,
  `member_id` INT,
  `date_added` DATE NOT NULL,
  FOREIGN KEY (`group_id`) REFERENCES `Groups` (`group_id`),
  FOREIGN KEY (`member_id`) REFERENCES `Users` (`user_id`),
  UNIQUE (`group_id`, `member_id`)
);
