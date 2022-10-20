# Simple user-servive

Steps to run this project:
1. cd into `user-service`
2. Make sure Mongodb is up and running
3. set the env vars 
4. Run `npm i` command
5. Run `npm run dev` command

Or run this service using docker-compose
make sure `DB_HOST` env var points to `mongo_db` docker service name
```bash
cd ${ROOT_FOLDER_OF_THIS_PROJECT}
docker-compose up -d
```
To tun typeorm-cli
`npm run typeorm -- {any typeorm command}`