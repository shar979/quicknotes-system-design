# QuickNotes System Design & API Client

QuickNotes is a robust note-taking web application and scalable system architecture designed to transition from a browser-only tool into an enterprise-ready service supporting 1 million users.

## Features
- **Interactive API Client:** Load existing server notes, create valid notes with real-time validation, and delete notes dynamically.
- **Robust Error Handling:** Integrated try/catch/finally blocks with clear loading, success, error, and empty states.
- **System Design Documentation:** Comprehensive API specs, relational database schema, and high-scale cloud architecture blueprints.

## How to Run the Project Locally
1. Clone the repository:
   ```bash
   git clone [https://github.com/shar979/quicknotes-system-design.git](https://github.com/shar979/quicknotes-system-design.git)

2. Navigate  to the folder docs
cd docs

3. Documentation Links
https://github.com/shar979/web-foundations-days/blob/main/docs/api-design.md



4. What I Learned
Client-Server State Synchronization: Managing local UI arrays alongside remote API endpoints (such as handling mocked DELETE responses correctly).

RESTful System Modeling: Designing clean endpoints, proper HTTP status codes, and error payloads for robust backend scalability.

High-Scale Infrastructure Planning: Calculating reads/writes per second, designing database read replicas, and mapping out caching and queuing strategies for 1 million active users.