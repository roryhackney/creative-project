--Rory Hackney
--Database SQL file, import into DB Browser (SQLite) to run
--Creates the database and fills it with data

BEGIN TRANSACTION;
-- reset db to create it again
DROP TABLE IF EXISTS user_supplies;
DROP TABLE IF EXISTS art_supplies;
DROP TABLE IF EXISTS user_supply_types;
DROP TABLE IF EXISTS supply_type_properties;
DROP TABLE IF EXISTS supply_types;
DROP TABLE IF EXISTS user_categories;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS types;
DROP TABLE IF EXISTS users;

-- user account
CREATE TABLE IF NOT EXISTS users (
    user_id         INTEGER,
    user_alias      TEXT,
    user_email      TEXT NOT NULL UNIQUE,
    user_password   TEXT NOT NULL,
    account_created DATE NOT NULL,
    last_login      DATE NOT NULL,
    profile_picture BLOB,
    PRIMARY KEY (user_id),
    CONSTRAINT CheckEmail                   CHECK (user_email LIKE "_%@_%._%"),
    CONSTRAINT CheckPassword                CHECK (LENGTH(user_password) >= 8),
    CONSTRAINT CheckAccountCreatedIsDate    CHECK (account_created IS DATE(account_created)),
    CONSTRAINT CheckLastLoginIsDate         CHECK (last_login IS DATE(last_login)),
    CONSTRAINT CheckLoginDate               CHECK (last_login >= account_created)
);

-- TESTING CONSTRAINTS
-- INSERT INTO users (user_email, user_password, account_created, last_login)
--     VALUES ("tammy.net", "password", "2024-07-11", "2024-10-04"); -- invalid email missing @
--     VALUES ("tammy@net", "password", "2024-07-11", "2024-10-04"); -- invalid email missing @
--     VALUES ("tammy.web@net", "password", "2024-07-11", "2024-10-04"); -- invalid email missing @
--     VALUES ("@web.net", "password", "2024-07-11", "2024-10-04"); -- invalid email nothing at beginning
--     VALUES ("tammy@.net", "password", "2024-07-11", "2024-10-04"); -- invalid email nothing in between
--     VALUES ("tammy@web.", "password", "2024-07-11", "2024-10-04"); -- invalid email nothing at end
--     VALUES ("t@w.x", "passwor", "2024-01-01", "2024-01-01"); -- password too short
--     VALUES ("t@w.x", "password", "2024-01-01", "2023-01-01"); -- login date before created date
--     VALUES ("t@w.x", "password", "nonsense", "2023-01-01"); -- account created is not a data
--     VALUES ("t@w.x", "password", "2024-01-01", "nonsense"); -- account created is not a data
--     VALUES ("t@w.x", "password", "2024-01-01", "nonsense"); -- account created is not a data
--     VALUES ("t@w.x", "password", "2024-01-01", "2024-01-01"); -- should pass

INSERT INTO users 
                    (user_email,            user_password, account_created, last_login) VALUES
                    ("tammy@gmail.com",         "password1", "2024-01-11", "2024-03-10"),
                    ("tommy@yahoo.com",         "password2", "2023-07-18", "2024-09-11"),
                    ("timmy@gmail.com",         "password3", "2024-11-01", "2024-11-04"),
                    ("sara@gmail.com",          "password4", "2022-11-11", "2022-11-11"),
                    ("sarah@yahoo.com",         "password5", "2023-08-21", "2024-09-08");

INSERT INTO users
    (user_alias,        user_email,         user_password, account_created, last_login) VALUES
    ("Pineapple",    "fineapple@gmail.com",     "password6",  "2024-05-01", "2024-09-27"),
    ("Awesome One",  "numberone@gmail.com",     "password7",  "2022-09-14", "2023-10-01"),
    ("Tomato Paste", "sauce@tomatosauce.com",   "password8",  "2023-11-26", "2024-11-10"),
    ("Worm",         "alittleguy@hotmail.com",  "password9",  "2024-07-07", "2024-07-10"),
    ("Pro User",     "prooooo@yahoo.com",       "password10", "2024-11-01", "2024-11-02");

-- type table since enums don't exist in sqlite
CREATE TABLE IF NOT EXISTS types (
    type_id     INTEGER,
    type_name   TEXT NOT NULL UNIQUE,
    PRIMARY KEY (type_id),
    CONSTRAINT NonEmptyName CHECK (trim(type_name) IS NOT "")
);

-- TESTING CONSTRAINTS
-- INSERT INTO types (type_name) VALUES ("");
-- INSERT INTO types (type_name) VALUES ("    ");

INSERT INTO types VALUES
    (1, "string"),
    (2, "boolean"),
    (3, "integer"),
    (4, "double");

-- property of an art supply type: name and validity rules
-- not really sure how to validate the valid_pattern...
CREATE TABLE IF NOT EXISTS properties (
    property_id     INTEGER,
    property_name   TEXT    NOT NULL UNIQUE,
    property_type   INTEGER NOT NULL,
    valid_pattern   TEXT,
    PRIMARY KEY (property_id),
    FOREIGN KEY (property_type) REFERENCES types(type_id),
    CONSTRAINT NameNotEmpty CHECK (trim(property_name IS NOT ""))
);

INSERT INTO properties (property_id, property_name, property_type) VALUES
    (1, "Color Name", 1),
    (2, "Color Code", 1),
    (3, "Shape", 1),
    (4, "Width", 3),
    (5, "Height", 3),
    (6, "Material", 1),
    (7, "Amount", 4),
    (8, "Pattern", 1),
    (9, "Size", 3),
    (10, "Thickness", 4),
    (11, "Waxed", 2);

INSERT INTO properties (property_name, property_type, valid_pattern) VALUES
    ("Color Hex", 1, "#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})");

-- category (abstract)
CREATE TABLE IF NOT EXISTS categories (
    category_id INTEGER,
    category_name TEXT  NOT NULL UNIQUE,
    PRIMARY KEY (category_id),
    CONSTRAINT NameNotBlank CHECK (trim(category_name) IS NOT "")
);

INSERT INTO categories VALUES
    (1, "Art Supply"),
    (2, "Painting"),
    (3, "Drawing"),
    (4, "Fabric Crafts"),
    (5, "Paper Crafts"),
    (6, "Watercolor"),
    (7, "Inking"),
    (8, "Bookmaking"),
    (9, "Ceramics"),
    (10, "Crochet");

-- associating categories with users
CREATE TABLE IF NOT EXISTS user_categories (
    id INTEGER,
    user_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    parent INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    FOREIGN KEY (parent) REFERENCES user_categories(id)
);

-- insert top parent Art Supply category into all users
INSERT INTO user_categories (id, user_id, category_id) VALUES
    (1, 1, 1), (2, 2, 1), (3, 3, 1), (4, 4, 1), (5, 5, 1),
    (6, 6, 1), (7, 7, 1), (8, 8, 1), (9, 9, 1), (10, 10, 1);

-- insert categories into various user accounts with various hierarchies
INSERT INTO user_categories VALUES
    (11, 1, 2, 1), (12, 1, 3, 1), (13, 1, 6, 11), (14, 1, 7, 12), -- user 1: painting, drawing, watercolor, inking
    (15, 2, 4, 2), (16, 2, 9, 2), (17, 2, 10, 15), -- user 2: fabric, ceramics, crochet
    (18, 3, 5, 3), (19, 3, 8, 18), -- user 3: paper, bookmaking
    (20, 4, 9, 4), -- ceramics
    (21, 5, 6, 5); -- paper crafts

CREATE TABLE IF NOT EXISTS supply_types (
    supply_type_id INTEGER,
    supply_type_name TEXT   NOT NULL UNIQUE,
    PRIMARY KEY (supply_type_id),
    CONSTRAINT NameNotBlank CHECK (trim(supply_type_name) IS NOT "")
);

INSERT INTO supply_types VALUES
    (1, "Marker"), (2, "Brush"), (3, "Clay"), (4, "Ink"), (5, "Dip Pen Nib"),
    (6, "Pen"), (7, "Crochet Hook"), (8, "Yarn"), (9, "Paper"), (10, "Thread");

CREATE TABLE IF NOT EXISTS supply_type_properties (
    id INTEGER,
    type_id INTEGER NOT NULL,
    prop_id INTEGER NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (type_id) REFERENCES supply_types(supply_type_id),
    FOREIGN KEY (prop_id) REFERENCES properties(property_id)
);

INSERT INTO supply_type_properties (type_id, prop_id) VALUES
    (1, 1), (1, 2), -- markers have colors
    (2, 3), (2, 6), (2, 9), -- brushes have material, shape, size
    (3, 6), (3, 7), -- clay has material and amount
    (4, 1), (4, 7), -- ink has color and amount
    (5, 3), -- nib has shape
    (6, 1), (6, 3), (6, 9), -- pens have color, shape, size
    (7, 9), -- crochet hooks have size
    (8, 1), (8, 6), (8, 10), -- yarn has color, material, thickness
    (9, 1), (9, 4), (9, 5), (9, 6), (9, 10), -- paper has color, width, height, material, thickness
    (10, 1), (10, 2), (10, 6), (10, 10), (10, 11); -- thread has color, material, thickness, may be waxed

CREATE TABLE IF NOT EXISTS user_supply_types (
    id INTEGER,
    user_id INTEGER NOT NULL,
    supply_type_id INTEGER NOT NULL,
    parent_category INTEGER NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (supply_type_id) REFERENCES supply_types(supply_type_id),
    FOREIGN KEY (parent_category) REFERENCES user_categories(id)
);

INSERT INTO user_supply_types (user_id, supply_type_id, parent_category) VALUES
    (1, 1, 12), (1, 2, 11), (1, 4, 14), (1, 5, 14), (1, 6, 14), (1, 9, 1), -- 1 has markers, brush, ink, nibs, pens, paper 
    (2, 3, 16), (2, 7, 17), (2, 8, 17), (2, 10, 17), -- 2 has clay, hook, yarn, thread
    (3, 9, 18), (3, 10, 19), -- paper, thread
    (4, 3, 20), -- clay
    (5, 9, 21); -- paper

CREATE TABLE IF NOT EXISTS art_supplies (
    art_supply_id INTEGER,
    art_supply_name TEXT    NOT NULL UNIQUE,
    art_supply_type INTEGER NOT NULL,
    brand_name TEXT,
    supply_image BLOB,
    demo_image BLOB,
    PRIMARY KEY (art_supply_id),
    FOREIGN KEY (art_supply_type) REFERENCES supply_types(supply_type_id),
    CONSTRAINT NameNotEmpty CHECK (trim(art_supply_name) IS NOT ""),
    CONSTRAINT BrandNotEmpty CHECK (trim(brand_name) IS NOT "")
);

INSERT INTO art_supplies (art_supply_id, art_supply_name, art_supply_type, brand_name) VALUES
    (1, "Rose Salmon Copic Classic Marker", 1, "Copic Classic"),
    (2, "Winsor & Newton Watercolor Sable Brush Round #6", 2, "Winsor & Newton"),
    (3, "Black Acrylic Ink Daler-Rowney", 4, "Daler-Rowney"),
    (4, "G Dip Pen Nib", 5, "JetPens"),
    (5, "0.1 Black Micron Pen", 6, "Sakura Pigma Micron"),
    (6, "B (2.25mm) Crochet Hook", 7, "Clover Soft Touch"),
    (7, "Off White Cotton Yarn Lily SnC", 8, "Lily Sugar n Cream"),
    (8, "Handmade Paper Shizen Purple/Gold Flowers", 9, "Shizen Paper"),
    (9, "Waxed Black Bookbinding Thread", 10, "Books By Hand"),
    (10, "Unwaxed Green Thread", 10, "Hollander");

CREATE TABLE IF NOT EXISTS user_supplies (
    id INTEGER,
    user_id INTEGER NOT NULL,
    supply_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    onWishlist BOOLEAN NOT NULL,
    storageLocation TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (supply_id) REFERENCES art_supplies (art_supply_id),
    CONSTRAINT ValidQuantity CHECK (quantity >= 0)
);

INSERT INTO user_supplies (user_id, supply_id, quantity, onWishlist, storageLocation) VALUES
    (1, 1, 1, FALSE, "Desk Drawer #1"),
    (1, 2, 0, TRUE, NULL),
    (1, 3, 2, FALSE, "Desk Drawer #3"),
    (1, 4, 10, FALSE, "Skull Tin on Bookshelf Shelf #2"),
    (1, 5, 2, FALSE, "Desk Drawer #1"),
    (2, 6, 1, FALSE, "Hook Storage Cup On Desk"),
    (2, 7, 1, FALSE, "Yarn Shelf #1"),
    (2, 9, 2, FALSE, "Desk Drawer"),
    (2, 10, 1, FALSE, "Desk Drawer"),
    (3, 8, 1, FALSE, "Paper Wall"),
    (3, 9, 1, FALSE, "Thread Bucket"),
    (3, 10, 1, FALSE, "Thread Bucket"),
    (5, 8, 3, FALSE, "Rolled Up In Closet");

--TODO: art_supplies_properties linking table that tracks values of custom properties for each art supply, eg supply Rose Copic Marker -> color Rose Salmon
COMMIT;

--intermediate steps for retrieving user supplies, in case I need it later
-- const step1 = `SELECT user_supplies.quantity, user_supplies.onWishlist, user_supplies.storageLocation
-- FROM user_supplies
-- WHERE user_supplies.user_id = 1`;
-- const step2 = `SELECT user_supplies.quantity, user_supplies.onWishlist, user_supplies.storageLocation
-- , art_supplies.art_supply_name, art_supplies.brand_name 
-- FROM user_supplies
-- INNER JOIN art_supplies ON user_supplies.supply_id = art_supplies.art_supply_id
-- WHERE user_supplies.user_id = 1`;
-- const step3 = `SELECT user_supplies.quantity, user_supplies.onWishlist, user_supplies.storageLocation
-- , art_supplies.art_supply_name, art_supplies.brand_name 
-- , supply_type_name 
-- FROM user_supplies
-- INNER JOIN art_supplies ON user_supplies.supply_id = art_supplies.art_supply_id 
-- INNER JOIN supply_types ON art_supplies.art_supply_type = supply_types.supply_type_id
-- WHERE user_supplies.user_id = 1`;
-- const step4 = `SELECT user_supplies.quantity, user_supplies.onWishlist, user_supplies.storageLocation
-- , art_supplies.art_supply_name, art_supplies.brand_name 
-- , supply_type_name 
-- , user_supply_types.supply_type_id
-- FROM user_supplies
-- INNER JOIN art_supplies ON user_supplies.supply_id = art_supplies.art_supply_id 
-- INNER JOIN supply_types ON art_supplies.art_supply_type = supply_types.supply_type_id 
-- INNER JOIN user_supply_types ON supply_types.supply_type_id = user_supply_types.supply_type_id 
-- WHERE user_supplies.user_id = 1`;
-- //5 rows
-- const step5 = `SELECT user_supplies.quantity, user_supplies.onWishlist, user_supplies.storageLocation
--                 , art_supplies.art_supply_name, art_supplies.brand_name 
--                 , supply_type_name 
--                 , user_supply_types.supply_type_id
--                 FROM user_supplies
--                 INNER JOIN art_supplies ON user_supplies.supply_id = art_supplies.art_supply_id 
--                 INNER JOIN supply_types ON art_supplies.art_supply_type = supply_types.supply_type_id 
--                 INNER JOIN user_supply_types ON supply_types.supply_type_id = user_supply_types.supply_type_id 
--                 INNER JOIN user_categories ON user_supply_types.parent_category = user_categories.id 
--                 WHERE user_supplies.user_id = 1`;
