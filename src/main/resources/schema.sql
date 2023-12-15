
-- Eliminar las tablas si existen

DROP TABLE IF EXISTS follow;
DROP TABLE IF EXISTS notification;
DROP TABLE IF EXISTS comment;
DROP TABLE IF EXISTS rates;
DROP TABLE IF EXISTS post_images;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS categories;


CREATE TABLE Users (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(60) NOT NULL,
    password VARCHAR(60) NOT NULL, 
    firstName VARCHAR(60) NOT NULL,
    lastName VARCHAR(60) NOT NULL, 
    email VARCHAR(60) NOT NULL,
    avatar VARCHAR(350) NOT NULL,
    role TINYINT NOT NULL
);

CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    price DECIMAL(19, 2) NOT NULL,
    creationDate DATETIME NOT NULL,
    expirationDate DATETIME,
    category_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    type TINYINT NOT NULL,
    couponCode VARCHAR(255) UNIQUE,
    isActive BOOLEAN NOT NULL DEFAULT true,
    stillValid DATETIME,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE post_images (
    post_id BIGINT NOT NULL,
    images VARCHAR(255) NOT NULL,
    PRIMARY KEY (post_id, images)
);

CREATE TABLE rates (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	user_id BIGINT NOT NULL,
	post_id BIGINT NOT NULL,
	rate BOOLEAN NOT NULL,
	FOREIGN KEY (user_id) REFERENCES Users(id),
	FOREIGN KEY (post_id) REFERENCES posts (id)
);

CREATE TABLE comment (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	postId BIGINT NOT NULL,
	userId BIGINT NOT NULL,
    	parentCommentId BIGINT,
	text VARCHAR(255) NOT NULL,
	FOREIGN KEY (postId) REFERENCES posts (id),
	FOREIGN KEY (userId) REFERENCES Users(id),
	FOREIGN KEY (parentCommentId) REFERENCES comment(id)
);

CREATE TABLE notification (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	postId BIGINT NOT NULL,
	userId BIGINT NOT NULL,
	commentId BIGINT,
    	parentCommentId BIGINT,
	FOREIGN KEY (postId) REFERENCES posts (id),
	FOREIGN KEY (userId) REFERENCES Users(id),
	FOREIGN KEY (commentId) REFERENCES comment(id),
	FOREIGN KEY (parentCommentId) REFERENCES comment(id)
);

CREATE TABLE follow(
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	postId BIGINT NOT NULL,
	userId BIGINT NOT NULL,
	expired BOOLEAN NOT NULL,
	FOREIGN KEY (postId) REFERENCES posts (id),
	FOREIGN KEY (userId) REFERENCES Users(id)
);