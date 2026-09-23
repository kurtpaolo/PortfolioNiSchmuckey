## Schmuckey

This is my personal portfolio website to showcase my video editing and content creation skills. I used my own portfolio `https://schmuckey.carrd.co/` as a reference on making this website with improvements as that original portfolio of mine is outdated.

This website also has a hidden feature I included, that said feature is based on one of my project idea called "Freelance Flow". It is used as a centralized place for freelancers to track current clients, tasks, and revenue. To access it, head to the footer and you can click the lock icon beside the copyright notice.

More details about Freelance Flow here:
`https://docs.google.com/document/d/1iVm5LkOzM-IWPbv8JPSib-64odm03VKmkS22-Cqw8Y8/edit?usp=sharing`

---

## Structure

```
C:\Users\schmuck\WOW\
│
├── index.php               # Home Page
├── services.php            # Services Page
├── about.php               # About Page
├── contact.php             # Contact Page 
├── app.php                 # My App (Freelance Flow Workspace)
├── admin.php               # Legacy redirect to index.php
├── serve.ps1               # Local web server script (runs on http://localhost:8000)
├── start-server.bat        # One-click website launch (This only works for Windows)
├── css/
│   ├── style.css           # Portfolio styling
│   └── app.css             # Freelance Flow styling
├── js/
│   ├── main.js             # Public site script
│   └── app.js              # Freelancer Flow app controller
└── assets/
    ├── images/             # Consists of images used for the website
    └── videos/             # Consists of thumbnail art from my original portfolio and youtube videos I edited for
```

---

## Running Locally

The local PowerShell web server is included in the project:
--> `serve.ps1`

Then visit `http://localhost:8000` in your browser.

or simply run the `start-server.bat` file (only if you're in windows)

## Admin Panel (Freelance Flow)

All data currently displayed in the admin panel is based on the Google Spreadsheet I use to track my clients, tasks, and cash flow. It is also not connected to any database whatsoever.

Spreadsheet Link: `https://docs.google.com/spreadsheets/d/1hIsCdzzRZXkMTdFphE4f2Oak74bxr0fbor3yt3Sg0Fo/edit?usp=sharing`


---

## Contact Form

The contact form is fully functional and connected to my own Discord server through a webhook. Messages submitted through the form are sent directly to a specific channel in my Discord server, allowing me to receive inquiries in real time.


##  Visual Notice

Some thumbnails or video preview may not work due to the following:
* You open the website just through a folder file (it needs to run through a local server like `start-server.bat` or `http://localhost:8000`).
* You are offline / have no internet connection.