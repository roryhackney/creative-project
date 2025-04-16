Developing a creative project for my web development course, namely an art supply tracking system, inspired by my own chaotic collection.

To use, download the project and run <code>npm install</code> in the terminal. Run <code>npm start</code> and then open the displayed link or localhost:8000/

User authentication has now been implemented. You can log in, log out, and register. Pages will redirect based on authentication requirements to ensure only valid access to content.
![image](https://github.com/user-attachments/assets/1e4ecf47-5bb9-40c5-8b21-65554679223b)

Once logged in, the system will display any art supplies you have in the database. It will also display your preferred name and email in the customize page. Still working on implementing adding art supplies, but you can add them manually in the database file or log in as user 1 (tammy@gmail.com, password1), who has 5 supplies already added, to demo the functionality.

![image](https://github.com/user-attachments/assets/43f4d463-2734-45e1-baed-9a1ccd0dee4e)

Try going to add-new.html and fill out the form. When you select a color family, it displays a bunch of colors you can select for the art supply you're adding. Cool stuff!
![image](https://github.com/user-attachments/assets/3f7f95d3-1ab8-4ad9-956a-043fae39d368)

To view the API documentation, open apidoc/index.html in the browser or open apidoc/APIDOC.md

Routing is handled using Node and Express, the database is relational (sqlite3). Authentication is handled through the database using SQL queries.

After learning more about React during my course, I implemented another version that uses React and Firebase, using a JSON database rather than SQL, and using built in authentication functions from Firebase, improving the security and reliability of my application. You can view that version at [creative-project-react](https://github.com/roryhackney/creative-project-react).
