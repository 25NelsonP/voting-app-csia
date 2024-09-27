# This is a IB Computer Science IA!

Through this IA, a voting system app will be made for the school's Student Council

# This project is prepared to be deployed on vercel.

Deploy the frontend and backend separately on different domains. Use .env.example for environement variable configuration. Frontend and backend have separate .env configurations.

# To run this project locally.

cd backend

npm start

cd frontend

npm start

the link will be at localhost:3000 for frontend and localhost:8080 for backend.

# Database

MYSQL database is used in this project.
Database information is to be added in the .env file in the backend.

# Google Group Import

It uses a custom api that includes the groups from google. Provided by the school.

# Folder Structure

VOTING-APP-CSIA
│
├── backend
│ ├── models
│ │ ├── Candidate.js
│ │ ├── Election.js
│ │ ├── EligibleGroup.js
│ │ ├── EligibleVoter.js
│ │ ├── Group.js
│ │ ├── GroupMember.js
│ │ ├── Position.js
│ │ ├── User.js
│ │ └── Vote.js
│ ├── routes
│ │ ├── election.js
│ │ ├── groups.js
│ │ ├── permissions.js
│ │ ├── user.js
│ │ └── vote.js
│ ├── .env
│ ├── .env.example
│ ├── .gitignore
│ ├── db.js
│ ├── package-lock.json
│ ├── package.json
│ ├── passport.js
│ ├── server.js
│ ├── vercel.json
│
├── frontend
│ ├── node_modules
│ ├── public
│ │ ├── index.html
│ │ └── manifest.json
│ ├── src
│ │ ├── assets
│ │ │ ├── constants
│ │ │ │ └── index.js
│ │ │ └── isylogo.png
│ │ ├── components
│ │ │ ├── modals
│ │ │ │ ├── AddGroupModal.js
│ │ │ │ ├── AddModal.js
│ │ │ │ ├── ConfirmDeleteGroupModal.js
│ │ │ │ ├── ConfirmDeleteUserModal.js
│ │ │ │ ├── ConfirmModal.js
│ │ │ │ ├── ConfirmRemoveAdminModal.js
│ │ │ │ ├── ConfirmRemoveMemberModal.js
│ │ │ │ ├── CreateGroupModal.js
│ │ │ │ ├── CSVImport.js
│ │ │ │ └── GoogleImport.js
│ │ │ ├── AdminHeader.js
│ │ │ ├── AdminProtectedRoutes.js
│ │ │ ├── CandidateCard.js
│ │ │ ├── ElectionCard.js
│ │ │ ├── ElectionFormFill.js
│ │ │ ├── Footer.js
│ │ │ ├── FormatDate.js
│ │ │ ├── FormEditHeader.js
│ │ │ ├── Header.js
│ │ │ ├── LoadingScreen.js
│ │ │ ├── ProtectedRoutes.js
│ │ │ └── VoteConfirmation.js
│ │ ├── pages
│ │ │ ├── admin
│ │ │ │ ├── forms
│ │ │ │ │ ├── Edit.js
│ │ │ │ │ ├── Permissions.js
│ │ │ │ │ ├── Responses.js
│ │ │ │ │ └── Settings.js
│ │ │ │ ├── Admins.js
│ │ │ │ ├── Group.js
│ │ │ │ ├── Groups.js
│ │ │ │ ├── Home.js
│ │ │ │ ├── Users.js
│ │ │ ├── info
│ │ │ │ ├── Closed.js
│ │ │ │ ├── NoAccess.js
│ │ │ │ ├── NotFound.js
│ │ │ │ ├── Voted.js
│ │ │ │ └── VoteSuccessful.js
│ │ │ ├── Home.js
│ │ │ ├── index.js
│ │ │ ├── Login.js
│ │ │ ├── Profile.js
│ │ │ └── Vote.js
│ │ ├── utils
│ │ │ ├── AuthCallback.js
│ │ │ └── useSession.js
│ │ ├── App.js
│ │ ├── index.css
│ │ └── index.js
│ ├── .env
│ ├── .env.example
│ ├── .gitignore
│ ├── package-lock.json
│ ├── package.json
│ ├── postcss.config.js
│ ├── README.md
│ └── tailwind.config.js
└── README.md
