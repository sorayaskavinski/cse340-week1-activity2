-- 1. Insert new records into the 'account' table
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES 
('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@an');

-- 2. Modify account Tony Sartk to "Admin"
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- 3 Delete the account of Tony Stark
DELETE FROM account
WHERE account_email = 'tony@starkent.com';

-- 4. Update the description of the veicule "GM Hummer" substituting "small interiors" to "a huge interior"
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- 5. Select make and model fields from the inventory table and the classification name field from the classification table for inventory items that belong to the "Sport" category
SELECT inv.inv_make, inv.inv_model, cls.classification_name
FROM inventory AS inv
INNER JOIN classification AS cls ON inv.classification_id = cls.classification_id
WHERE cls.classification_name = 'Sport';

-- 6. Uptade all records in the inventory table to add "/vehicles" to the middle of the file path in the inv_image and inv_thumbnail columns using a single query
UPDATE inventory
SET
 inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
 inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');