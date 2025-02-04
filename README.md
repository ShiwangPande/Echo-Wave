# Echo-Wave

Echo-Wave is a next-generation communication platform designed for seamless collaboration, vibrant communities, and dynamic conversations.  It offers features for text, audio, and video communication within servers and direct messages.

## Features and Functionality

* **Server Creation:** Create and customize servers with unique names and images.
* **Channel Creation:** Create text, audio, and video channels within servers.  "general" channel is automatically created upon server creation.
* **User Authentication:** Secure user authentication and authorization using Clerk.
* **Text Chat:** Send and receive text messages in channels and direct messages. Includes support for file attachments (images and PDFs).
* **Audio & Video Calls:** Conduct real-time audio and video calls within designated channels.  Leverages LiveKit for real-time communication.
* **Direct Messaging:** Send private messages to other users within the same server.
* **Invite System:** Generate and share invite codes to add users to your server.
* **Member Management (Admin/Moderator):** Admins and moderators can manage members' roles, kick members from the server, and delete messages.
* **Role-Based Permissions:** Different user roles (Admin, Moderator, Guest) have varying permissions within the server.
* **Dark Mode:**  Supports dark and light mode themes.



## Technology Stack

* **Frontend:** Next.js, React, Tailwind CSS, Radix UI, Lucide React, @emoji-mart/react, @tanstack/react-query, Uploadthing
* **Backend:** Next.js API Routes, Prisma, PostgreSQL, Clerk, Socket.IO, LiveKit
* **Database:** PostgreSQL


## Prerequisites

* Node.js and npm (or yarn)
* A PostgreSQL database (local or cloud-based)
* Environment variables (see `.env.example`) - you'll need to obtain  `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `LIVEKIT_URL`, and `NEXT_PUBLIC_LIVEKIT_URL` from LiveKit and set up Clerk.  The `NEXT_PUBLIC_SITE_URL`  needs to be your site's URL.

## Installation Instructions

1. Clone the repository: `git clone https://github.com/ShiwangPande/Echo-Wave.git`
2. Navigate to the project directory: `cd Echo-Wave`
3. Install dependencies: `npm install` or `yarn install`
4. Set up your environment variables by creating a `.env` file based on `.env.example`.


## Usage Guide

1. **Run the development server:** `npm run dev` or `yarn dev`
2. Sign in or sign up using the provided Clerk authentication.
3. Create a new server or join an existing server using an invite code.
4. Navigate through servers and channels to start chatting.


## API Documentation

The API routes are primarily used for server-side logic and data persistence. Key APIs include:

* `/api/servers`:  POST request to create a new server.
* `/api/servers/[serverId]`: PATCH for updates (name, image), DELETE to delete a server.
* `/api/servers/[serverId]/invite-code`: PATCH to regenerate an invite code.
* `/api/servers/[serverId]/leave`: PATCH to leave a server.
* `/api/channels`: POST to create a channel (requires serverId in query parameters).
* `/api/channels/[channelId]`: PATCH to update a channel, DELETE to delete a channel (requires serverId in query parameters).
* `/api/messages`: GET for fetching messages (requires channelId in query parameters), POST to create a message (requires channelId and serverId in query parameters).
* `/api/direct-messages`: GET for fetching direct messages (requires conversationId in query parameters), POST to send a direct message (requires conversationId in query parameters).
* `/api/members/[memberId]`: PATCH to update a member's role, DELETE to remove a member (requires serverId in query parameters).
* `/api/token`: GET for generating LiveKit access tokens (requires room and username in query parameters).
* `/api/uploadthing`: Upload file API using Uploadthing.

Detailed documentation for each endpoint can be found in the respective `.ts` files within the `app/api` directory.


## Contributing Guidelines

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with clear and concise messages.
4. Push your branch to your fork.
5. Create a pull request to the main branch of this repository.


## License Information

(Not specified in the repository. Please add a license.)


## Contact/Support Information

(Please add contact information.)
