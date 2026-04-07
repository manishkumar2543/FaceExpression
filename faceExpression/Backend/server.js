require('dotenv').config()
const app=require('./src/app')

const ConnectedToDb=require('./src/config/database')
ConnectedToDb()



app.listen(3000,()=>{
    console.log("server is running on port 3000")
})