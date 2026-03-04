# Admin Credentials

## Default Admin (Staff) Account

These credentials are **seeded automatically** when the OrlandoProject backend starts for the first time.

| Field    | Value                          |
|----------|--------------------------------|
| Email    | `orlandoprestige@gmail.com`    |
| Password | `Orlando@Prestige0304`         |
| Role     | `STAFF` (Admin)                |

## Notes

- The admin user is created by the `DataSeeder` class (`ApplicationRunner`) on backend startup.
- If the email already exists in the `staff` table, the seeder **skips** creation (idempotent).
- The password is stored as a **BCrypt hash** in the database — the plaintext is never stored.
- To change the password, update the `DataSeeder.java` and restart, or update the hash directly in the database.
- This account has **full admin privileges**: product management, order evaluation, inventory management, customer management.

## Security Warning

> **Do not commit production credentials to source control.**  
> These credentials are for **development and testing only**. In production, change the admin password immediately after first login or use environment variables to configure the seed credentials.
