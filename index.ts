import express, {Application, Request, Response} from "express"
import mongoose from "mongoose"

const port:number = 1000
const url:string = "mongodb://0.0.0.0:27017/klass"
const app: Application = express()

interface client{
    name: string,
    email: string,
    isActive: boolean,
    age: number
}

interface iClient extends client, mongoose.Document{}

const schemaClient = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    isActive: {
        type: Boolean
    },
    age: {
        type: Number
    }
    
})

const dataModel = mongoose.model<iClient>("client",schemaClient)

app.use(express.json())

app.post("/api/v1/post-client", async (req:Request, res:Response)=>{
    try
    {
        const {name, email, isActive,age} = req.body
        if(!name || !email || !isActive || !age)
        {
            return res.status(404).json({
                message: "all field is important"
            })
        }
        const  data = await dataModel.create({
            name,
            email,
            isActive,
            age
        })
        return res.status(201).json({
            message: "created successfully",
            result: data
        })
    }catch(error: any)
    {
        return res.status(404).json({
            message:error.message
        })
    }
})

app.get("/api/v1/get-all", async(req:Request, res:Response)=>{
    try
    {
        const dataAll = await dataModel.find()
        return res.status(200).json({
            message: "all data",
            result: dataAll
        })
    
    }catch(error: any)
    {
        return res.status(404).json({
            message:error.message
        })
    }
})
mongoose.connect(url).then(()=>{
    console.log("databased connected successfully")
}).catch((error:any)=>{
    console.log("an error occured", error)
})

const server = app.listen(port, ()=>{console.log("listening on port",port)})
process.on("uncaughtException", (error:Error)=>{
    console.log("stop here: uncaughtException")
    console.log(error)
    process.exit(1)
})

process.on("unhandledRejection", (reason:any)=>{

    console.log("stop here: unhandleRejection")
    console.log(reason)

    server.close(()=>{
        process.exit(1)
    })
})
app.delete("/api/v1/delete-one/:id", async(req:Request, res:Response)=>{
    try{
        const dataId = req.params.id
        const deletedData = await dataModel.findByIdAndDelete(dataId)
        

        if (!deletedData){
            return res.status(404).json({
                status: "failed to update",
                message: "no data with the id: " + dataId + "was found to delete"
            })
        }
        return res.status(200).json({
            status: "success",
            message: "data deleted successfully",
            result: deletedData
        })
    }catch(error:any)
    {
        return res.status(500).json({
            status: "failed",
            message: error.message
})
}
})
app.put("/api/v1/update-client/:id",async(req:Request,res:Response)=>{
    const updateData = await dataModel.findByIdAndUpdate(req.params.id,req.body)
    try{
return res.status(200).json({
    success:1,
    message:"data successfully updated",
    data:updateData
})
    }catch(err){
        return res.status(500).json({
            status: "failed",
            message: Error
});

    };

});

