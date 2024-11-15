Developing a creative project for my web development course, namely an art supply tracking system, inspired by my own chaotic collection.

To use, download the project and run <code>npm install</code> in the terminal. Run <code>npm start</code> and then open the displayed link or localhost:8000/

Try going to add-new.html and fill out the form. When you select a color family, it displays a bunch of colors you can select for the art supply you're adding. Cool stuff!

User authentication has now been implemented. You can log in, log out, and register. Pages will redirect based on authentication requirements to ensure only valid access to content.

Once logged in, the system will display any art supplies you have in the database. It will also display your preferred name and email in the customize page. Still working on implementing adding art supplies, but you can add them manually in the database file or log in as user 1 (tammy@gmail.com, password1), who has 5 supplies already added, to demo the functionality.

To view the API documentation, open apidoc/index.html in the browser or open apidoc/APIDOC.md