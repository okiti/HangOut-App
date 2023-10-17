# HangOut-App
Building a single larger application to locate hangout spots along a particular region (case study Lagos Nigeria) using Javascript, templating, express, mongodb e.t.c


## Authentication
1. Made use of passport authentication middleware for Node.js to implement authentication for login and register pages.
2. Created a user Model, Register and Login forms and routes, Logout route e.t.c

## Basic Authorization
Added hangout authors , authorization middlewares, hangout permissions and review permissions


## Image Upload
1. Used Cloudinary to store images adn further store their urls in the database.
2. Used express middleware (multer) to parse/handle multipart/form-ata for uploading files.
3. dotenv to store codes, API credentials/secret key
4. used carousel (bootstrap) to scroll through multiple images in the show page.
5. multer-storage-cloudinary - to upload files that multer is parsing to cloudinary.

