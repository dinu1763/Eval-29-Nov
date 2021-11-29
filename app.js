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
    rating:{type:Number, required:false},
    city:{type:String, required:true}
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

app.get("/company_details", async (req, res) =>{
    try{
        const company = await Company.find({company_name:"Wipro"},{company_description:1, company_name:1}).lean().exec();
        return res.status(201).send(company);
    } catch (e){
        return res.status(500).send({e})
    }
});



app.get("/job_openings", async (req, res) =>{
    try{
        const company = await Company.find({job_openings: {$gt:60}}, {company_name:1, job_openings:1}).lean().exec();
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

app.get("/bangalore", async (req, res) =>{
    try{
        const jobs = await Job.find({$and: [{city:"Bangalore"},{skills:"Python"}]}).lean().exec();
        return res.status(201).send(jobs);
    } catch (e){
        return res.status(500).send({e})
    }
});

app.get("/wfh", async (req, res) =>{
    try{
        const jobs = await Job.find({job_type:"Work From Home"}).lean().exec();
        return res.status(201).send(jobs);
    } catch (e){
        return res.status(500).send({e})
    }
});

app.get("/notice", async (req, res) =>{
    try{
        const jobs = await Job.find({notice_period:60}).lean().exec();
        return res.status(201).send(jobs);
    } catch (e){
        return res.status(500).send({e})
    }
});

app.get("/rating", async (req, res) =>{
    try{
        const jobs = await Job.find({},{job_name:1, rating:1}).sort({rating:-1}).lean().exec();
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