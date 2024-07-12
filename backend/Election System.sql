CREATE TABLE `Users` (
  `user_id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `email` varchar(100)
);

CREATE TABLE `Elections` (
  `election_id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(100),
  `start_date` date,
  `end_date` date
);

CREATE TABLE `Positions` (
  `position_id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(100),
  `description` text
);

CREATE TABLE `Candidates` (
  `candidate_id` int PRIMARY KEY AUTO_INCREMENT,
  `student_id` int,
  `election_id` int,
  `essay` varchar(3500),
  `position_id` int
);

CREATE TABLE `Votes` (
  `vote_id` int PRIMARY KEY AUTO_INCREMENT,
  `election_id` int,
  `voter_id` int,
  `candidate_id` int,
  `timestamp` datetime
);

CREATE TABLE `EligibleVoters` (
  `eligible_voter_id` int PRIMARY KEY AUTO_INCREMENT,
  `election_id` int,
  `student_id` int
);

CREATE TABLE `Admin` (
  `admin_id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int
);

CREATE TABLE `Group` (
  `group_id` int PRIMARY KEY AUTO_INCREMENT,
  `group_name` varchar(255)
);

CREATE TABLE `Group_Member` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `group_id` int,
  `member_id` int,
  `dateadded` date
);

ALTER TABLE `EligibleVoters` ADD FOREIGN KEY (`election_id`) REFERENCES `Elections` (`election_id`);

ALTER TABLE `EligibleVoters` ADD FOREIGN KEY (`student_id`) REFERENCES `Users` (`user_id`);

ALTER TABLE `Group_Member` ADD FOREIGN KEY (`group_id`) REFERENCES `Group` (`group_id`);

ALTER TABLE `Group_Member` ADD FOREIGN KEY (`member_id`) REFERENCES `Users` (`user_id`);

ALTER TABLE `Candidates` ADD FOREIGN KEY (`student_id`) REFERENCES `Users` (`user_id`);

ALTER TABLE `Candidates` ADD FOREIGN KEY (`election_id`) REFERENCES `Elections` (`election_id`);

ALTER TABLE `Candidates` ADD FOREIGN KEY (`position_id`) REFERENCES `Positions` (`position_id`);

ALTER TABLE `Votes` ADD FOREIGN KEY (`election_id`) REFERENCES `Elections` (`election_id`);

ALTER TABLE `Votes` ADD FOREIGN KEY (`voter_id`) REFERENCES `Users` (`user_id`);

ALTER TABLE `Votes` ADD FOREIGN KEY (`candidate_id`) REFERENCES `Candidates` (`candidate_id`);

ALTER TABLE `Admin` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`);
