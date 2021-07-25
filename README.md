typeface is Dokdo

//command to install
npm install

//command for development
npx tailwindcss -o ./build/tailwind.css --watch     

//command for production:
NODE_ENV=production npx tailwindcss -i ./styles.css -o ./build/tailwind.css --minify
