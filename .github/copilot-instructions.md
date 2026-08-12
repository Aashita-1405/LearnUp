# Copilot Instructions for LearnUp

## Project purpose
This repo is a learning app demo that implements a simple authentication flow with:
- React frontend for sign up and login
- Express backend with SQLite persistence
- Protected page that requires authentication

## Preferred AI models
Use ChatGPT, Claude, and Gemini as supportive reference models for:
- generating implementation ideas
- reviewing authentication logic
- proposing improvements to validation and security
- generating concise documentation and summaries

## Development expectations
- Prefer secure, minimal, and readable code.
- Keep API responses consistent: `message`, `user`, and `token` where needed.
- Validate all user input before writing to the database.
- Hash all passwords before saving.
- Use JWT tokens for protected routes and store them in cookies for the demo app.
- Keep frontend and backend logic separated to make debugging easier.

## Repo conventions
- Backend code lives in `src/`.
- Frontend code lives in `client/src/`.
- Use SQLite as the local database for simple data persistence.
- Use `npm test` for automated checks and `npm run dev` for local development.
