# Supermarket-Zlagoda-
This is a full-stack implementation for the supermarket's website. 

# run the application
<p>Firstly, run npm install and make sure you have a 'concurently' package installed.</p>
<p>Then run 'npm start'</p>
<ul>
  <li>To run ONLY backend -- go to backend folder and run "python server.py"</li>
  <li>To run ONLY frontend - go to frontend folder and run "npm start" </li>
</ul>

# env
To run the application your .env.local file should look like this:

```
DB_LINK # place a local link to the database
SECRET_KEY="2$53423$@#23423" # you can place any key u wish. Be mindful since it's used for hashing!
ALGORITHM = "HS256"
```
# login 
You can find pre-made accounts in /backend/database/first_accounts.py . Use the email and password to regitster.
If u are a manager, you will be able to add new employees (cashiers)
