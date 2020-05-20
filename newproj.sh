#This is a comment in bash script
#make a directoy and put this file in it
#mkdir myNewProjectName
#Then run this file to run all the commands
#bash thisFileName.sh
#These commands are now automatically typed into the command line for you
npm init -y
npm install express
npm install --save-dev typescript ts-node nodemon @types/express
mkdir src
touch src/index.ts
tsc --init
#add the start script to package.json under "scripts"
#   "start":"nodemon --exec ts-node src/index.ts"
#
#this command will then run package.json and nodemon will wait for changes
#npm start