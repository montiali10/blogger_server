## 1. install dependencies
```
    npm install
```
make sure there is a mysql database running on port 3306.
ensure that the database credentials match the ones in the .env file.
in this format:
```
    mysql://USERNAME:PASSWORD@localhost:3306/blogger
```
for me USERNAME: root and PASSWORD: empty
```
    mysql://root:@localhost:3306/blogger
```

## 2. Run migrations
```
    npx prisma generate
```
if you need a database interface, Prisma can provide you with one through:
```
    npx prisma studio
```



