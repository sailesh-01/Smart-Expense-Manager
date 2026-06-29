@echo off
echo Starting Smart Expense Manager...

echo Starting Server...
start cmd /k "cd server && npm run dev"

echo Starting Client...
start cmd /k "cd client && npm run dev"

echo Done! Both client and server should now be running in separate windows.
