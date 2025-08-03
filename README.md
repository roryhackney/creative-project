# creative-project
The Art Supply Tracker is a personal project I’ve been working on since 2024, inspired by my desire to organize, track, and easily search for my own art supplies while out shopping.

**Version 1**: [art-supply-tracker](https://github.com/roryhackney/art-supply-tracker)  
After gaining confidence developing software and programming in my CS courses, I began exploring ways to create an application to manage my art supply collection. After creating an initial mobile first [UX design](https://www.figma.com/design/0LxqJbBWnw07SKJpn5pTVx/Art-Supply-Tracker--Mobile-) in Figma, I began exploring React and Firebase to develop a mobile first website during my summer break.

![image](https://github.com/user-attachments/assets/9d7b3e59-3353-4961-8f7b-1153babeff92)

  
**Version 2**: [creative-project](https://github.com/roryhackney/creative-project)  
After learning more about Node, Express, and SQL in the fall of my senior year, I redesigned the application using this repo, improving the UX and implementing additional features including a SQL database tracking users, art supply categories, properties, and inventory, enabling authentication and routing using Node and Express. I also learned to use APIs, integrating a feature to display clickable color options fetched from an API based on the user's color family selection. Although the application worked, it was difficult to maintain and expand features because I was writing SQL, HTML, and JavaScript/Node code manually rather than using a framework or other tools.

![image](https://github.com/user-attachments/assets/3f7f95d3-1ab8-4ad9-956a-043fae39d368)
  

**Verson 3**: [creative-project-react](https://github.com/roryhackney/creative-project-react)  
After learning more about React, software design, and cloud computing, I created an improved version during my senior web development course, implementing additional features including both stronger authentication and a JSON database backed by Firebase / Google Cloud, unit tests using JUnit, and dynamic forms utilizing React components that generate fields based on user choices (for example, after selecting a category of art supply like paintbrush or yarn, different fields are generated, like color, weight, or material). As part of the process, I was able to learn a lot about software design, developing more organized and maintainable applications using React components, the challenges and rewards of cloud services, and the tradeoffs between SQL and more flexible NoSQL / JSON databases.

![image](https://github.com/user-attachments/assets/653a03e7-ef88-4768-a1b3-e5558fdc8e57)

---

To run the application, clone the repo and run <code>npm install</code> in the terminal. Run <code>npm start</code> and then open the displayed link or localhost:8000/.

User authentication has now been implemented. You can log in, log out, and register. Pages will redirect based on authentication requirements to ensure only valid access to content.

![image](https://github.com/user-attachments/assets/1e4ecf47-5bb9-40c5-8b21-65554679223b)

Once logged in, the system will display any art supplies you have in the database. It will also display your preferred name and email in the customize page. Still working on implementing adding art supplies, but you can add them manually in the database file or log in as user 1 (tammy@gmail.com, password1), who has 5 supplies already added, to demo the functionality.

![image](https://github.com/user-attachments/assets/43f4d463-2734-45e1-baed-9a1ccd0dee4e)

Try going to add-new.html and fill out the form. When you select a color family, it displays a bunch of colors you can select for the art supply you're adding. Cool stuff!

![image](https://github.com/user-attachments/assets/3f7f95d3-1ab8-4ad9-956a-043fae39d368)

To view the API documentation, open apidoc/index.html in the browser or open apidoc/APIDOC.md.

Routing is handled using Node and Express, the database is relational (sqlite3). Authentication is handled through the database using SQL queries.

After learning more about React during my course, I implemented another version that uses React and Firebase, using a JSON database rather than SQL, and using built in authentication functions from Firebase, improving the security and reliability of my application. You can view that version at [creative-project-react](https://github.com/roryhackney/creative-project-react).
