const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

const connect = () =>{
    return mongoose.connect("mongodb://127.0.0.1:27017/naukri_DB");
}

const jobSchema = new mongoose.Schema({
    job_name : {type:String, required:true},
    skills:{type:String, required:true},
    job_type:{type:String, required:true},
    notice_period : {type:Number, required:true},
    rating:{type:Number, required:false}
},{
    versionKey: false,
    timestamps: true
});

const Job = mongoose.model("job", jobSchema); //jobs 

const companySchema = new mongoose.Schema({
    company_name : {type:String, required:true},
    job_openings : {type:Number, required:true},
    company_description : {type:String, required:true},

},{
    versionKey: false,
    timestamps: true
})

const Company = mongoose.model("company", companySchema);
/* COMPANY DETAILS */
app.get("/company", async (req, res) =>{
    try{
        const company = await Company.find().lean().exec();
        return res.status(201).send(company);
    } catch (e){
        return res.status(500).send({e})
    }
});

app.post("/company", async (req, res) =>{
    try{
        const company = await Company.create(req.body);
        return res.status(201).send(company);
    } catch (e){
        return res.status(500).send({e})
    }
});

app.patch("/company/:id", async (req, res) =>{
    try {
        const company = await Company.findByIdAndUpdate(req.params.id, req.body, {new: true});
        return res.send(company);
    } catch (e){
        return res.status(500).send({e})
    }
});

app.delete("/company/:id", async (req, res) =>{
    try {
        const company = await Company.findByIdAndDelete(req.params.id);
        return res.send(company);
    } catch (e){
        return res.status(500).send({e})
    }
})

/* JOBS DETAILS */
app.get("/", async (req, res) =>{
    try{
        const jobs = await Job.find().lean().exec();
        return res.status(201).send(jobs);
    } catch (e){
        return res.status(500).send({e})
    }
});

app.post("/", async (req, res) =>{
    try{
        const jobs = await Job.create(req.body);
        return res.status(201).send(jobs);
    } catch (e){
        return res.status(500).send({e})
    }
});

app.patch("/:id", async (req, res) =>{
    try {
        const jobs = await Job.findByIdAndUpdate(req.params.id, req.body, {new: true});
        return res.send(jobs);
    } catch (e){
        return res.status(500).send({e})
    }
});

app.delete("/:id", async (req, res) =>{
    try {
        const jobs = await Job.findByIdAndDelete(req.params.id);
        return res.send(jobs);
    } catch (e){
        return res.status(500).send({e})
    }
})

app.listen("9000", async ()=>{
    await connect();
    console.log("Listening to Port 9000");
})