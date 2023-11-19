# Database

## Usefull commands

### Create a new migration
Before creating a migration, reset your database to the latest migration. (or delete the database and apply all migrations again)

```bash
pnpm prisma migrate dev  --create-only
```

### Apply all migrations
```bash
pnpm prisma migrate deploy
```
