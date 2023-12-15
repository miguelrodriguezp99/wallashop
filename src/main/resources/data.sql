-- Crear categorias
insert into categories (name) values ('Electronics');
insert into categories (name) values ('Clothes');
insert into categories (name) values ('Furniture');
insert into categories (name) values ('Books');

-- Insertar usuarios si no existen
INSERT INTO Users (userName, password, firstName, lastName, email, avatar, role)
VALUES
    ('usuario1', 'contrasena1', 'Nombre1', 'Apellido1', 'usuario1@example.com', 'https://random.imagecdn.app/501/500', 0),
    ('usuario2', 'contrasena2', 'Nombre2', 'Apellido2', 'usuario2@example.com', 'https://random.imagecdn.app/501/500', 0),
    ('usuario3', 'contrasena3', 'Nombre3', 'Apellido3', 'usuario3@example.com', 'https://random.imagecdn.app/501/500', 0),
    ('usuario4', 'contrasena4', 'Nombre4', 'Apellido4', 'usuario4@example.com', 'https://random.imagecdn.app/501/500', 0),
    ('usuario5', 'contrasena5', 'Nombre5', 'Apellido5', 'usuario5@example.com', 'https://random.imagecdn.app/501/500', 0),
    ('usuario6', 'contrasena6', 'Nombre6', 'Apellido6', 'usuario6@example.com', 'https://random.imagecdn.app/501/500', 0),
    ('usuario7', 'contrasena7', 'Nombre7', 'Apellido7', 'usuario7@example.com', 'https://random.imagecdn.app/501/500', 0),
    ('usuario8', 'contrasena8', 'Nombre8', 'Apellido8', 'usuario8@example.com', 'https://random.imagecdn.app/501/500', 0),
    ('usuario9', 'contrasena9', 'Nombre9', 'Apellido9', 'usuario9@example.com', 'https://random.imagecdn.app/501/500', 0);

INSERT INTO posts (title, description, url, price, creationDate, expirationDate, category_id, user_id, type, couponCode, isActive)
VALUES
    ('Post 1', 'Este es el primer post de ejemplo. Alargo un poco esto', 'https://random.imagecdn.app/501/500', 25.99, NOW(), DATEADD('YEAR', 1, NOW()), 1, 1, 0, NULL, true),
    ('Post 2', 'Un segundo post para mostrar funcionalidad.', 'https://random.imagecdn.app/503/500', 19.95, NOW(), DATEADD('YEAR', 1, NOW()), 2, 2, 1, 'ABC123', true),
    ('Post 3', 'Descripción del tercer post. Alargo un poco esto', 'https://random.imagecdn.app/505/500', 35.50, NOW(), DATEADD('YEAR', 1, NOW()), 3, 3, 0, NULL, true),
    ('Post 4', 'Cuarto post con detalles interesantes.', 'https://random.imagecdn.app/507/500', 9.99, NOW(), DATEADD('YEAR', 1, NOW()), 4, 4, 1, 'DEF456', true),
    ('Post 5', 'Post número cinco para mostrar algo más.', 'https://random.imagecdn.app/509/500', 49.99, NOW(), DATEADD('YEAR', 1, NOW()), 1, 5, 0, NULL, true),
    ('Post 6', 'Descripción del sexto post en el JSON.', 'https://random.imagecdn.app/500/502', 29.95, NOW(), DATEADD('YEAR', 1, NOW()), 2, 6, 1, 'GHI789', true),
    ('Post 7', 'Séptimo post con detalles adicionales.', 'https://random.imagecdn.app/500/504', 15.75, NOW(), DATEADD('YEAR', 1, NOW()), 3, 7, 0, NULL, true),
    ('Post 8', 'Descripción del octavo post en el JSON.', 'https://random.imagecdn.app/500/506', 12.99, NOW(), DATEADD('YEAR', 1, NOW()), 4, 8, 1, 'JKL012', true),
    ('Post 9', 'Noveno post con detalles interesantes.', 'https://random.imagecdn.app/500/500', 59.99, NOW(), DATEADD('YEAR', 1, NOW()), 1, 9, 0, NULL, true);

-- Insertar datos de imágenes de posts
INSERT INTO post_images (post_id, images)
VALUES
    (1, 'https://random.imagecdn.app/501/500'),
    (1, 'https://random.imagecdn.app/502/500'),
    (2, 'https://random.imagecdn.app/503/500'),
    (2, 'https://random.imagecdn.app/504/500'),
    (3, 'https://random.imagecdn.app/505/500'),
    (3, 'https://random.imagecdn.app/506/500'),
    (4, 'https://random.imagecdn.app/507/500'),
    (4, 'https://random.imagecdn.app/508/500'),
    (5, 'https://random.imagecdn.app/509/500'),
    (5, 'https://random.imagecdn.app/500/501'),
    (6, 'https://random.imagecdn.app/500/502'),
    (6, 'https://random.imagecdn.app/500/503'),
    (7, 'https://random.imagecdn.app/500/504'),
    (7, 'https://random.imagecdn.app/500/505'),
    (8, 'https://random.imagecdn.app/500/506'),
    (8, 'https://random.imagecdn.app/500/507'),
    (9, 'https://random.imagecdn.app/500/500'),
    (9, 'https://random.imagecdn.app/509/500');


