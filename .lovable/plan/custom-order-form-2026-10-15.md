# Custom Order Form

## What will be added
- A dedicated `/custom-order` page matching Punarvsu’s existing regal style.
- Fields for preferred design, quantity, occasion, name, email, phone, optional needed-by date, and notes.
- Clear validation, submission progress, success confirmation, and retry feedback.
- Custom-order links from the out-of-stock collection state and sold-out product message.

## Data and privacy
- Save each request securely in Lovable Cloud so it is not lost or dependent on WhatsApp.
- Allow public submissions, while limiting request viewing and management to authorized editors/admins.
- Apply length, format, quantity, and date validation in both the form and database.

## Technical details
- Use Zod validation and the existing Lovable Cloud client.
- Add the page through the project’s retry-safe page loading pattern.
- Preserve all existing product, collection, checkout, and contact behavior.
- Verify validation, successful submission, link navigation, and the current build/tests.
