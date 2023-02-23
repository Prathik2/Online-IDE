
import './App.css';
import axios from 'axios';
import React, {useState , useEffect} from 'react';
import stubs from './defaultStubs';
import moment from 'moment';

function App() {

  const [code, setCode] = useState("");
  const [language ,setLanguage] = useState("cpp");
  const [output,setOutput] = useState("");
  const [status,setStatus] = useState("");
  const [jobId,setJobId] = useState("");
  const [joDetails, setJobDetails] = useState(null);

  useEffect(() =>{
    setCode(stubs[language]);
  }, [language]);

  const renderTimeDetails = ( ) => {
    if(!joDetails){
      return "";

    }
    let result = '';
    let { submittedAt, completedAt, startedAt} = joDetails;
    submittedAt = moment(submittedAt).toString()
    result += `Submitted At: ${submittedAt}\n`

    if(!completedAt || !startedAt) {
      return result;
    }
    const start = moment(startedAt);
    const end = moment(completedAt);
    const executionTime = end.diff(start, 'seconds' , true);
    
    result += `Ececution Time: ${executionTime}s`;
    return result;
  }

  const handleSubmit = async()=>{
    
    const payload ={
      language,
      code
    };
    try{
      setJobId("");
      setStatus("");
      setOutput("");
      setJobDetails(null);
    const {data} = await axios.post("http://localhost:5000/run",payload);
    console.log(data);
    setJobId(data.jobId);
    let intervalId;

    intervalId = setInterval(async() => {
      const {data: dataRes} = await axios.get(
        "http://localhost:5000/status",
        {
          params: {id : data.jobId}
        }
        //console.log(dataRes);
      );
      const {success ,job,error}= dataRes;
      console.log(dataRes);


      if(success){
        const {status : jobStatus,output : jobOutput} = job;
        setStatus(jobStatus);
        setJobDetails(job);
        if(jobStatus === "pending") return;
        setOutput(jobOutput);
        clearInterval(intervalId);
      } else {
        setStatus("Error: Please retry!");
        console.error(error);
        clearInterval(intervalId);
        setOutput(error);
      }

      console.log(dataRes);
    }, 1000);
    }catch({response}){
      if(response){
        const errMsg = response.data.err.stderr;
        setOutput(errMsg);
      }else{
        setOutput("Error connecting to server");
      }
    }
  }
  return (
    
    <div className="App">
      
      <h1>Online code Compiler <span>powered by codeCheck</span></h1>
      <div>
      <label>Language: </label>
        <select
        value={language} 
        onChange={(e) =>{
          let response = window.confirm(
            "Warning: Switching the language, will remove your current code.Do you wish to process?"
          );
          if(response){
          setLanguage(e.target.value);}
          console.log(e.target.value);        
        }}>
          <option value="cpp">C++</option>
          <option value="py">Python</option>
          <option value="java">Java</option>
        </select>
      </div>
      <br />
      <textarea placeholder='Write you code here' rows="20" cols="75" value={code} 
      onChange={(e)=>{
        setCode(e.target.value);
      }}>
      </textarea>
      <br></br>      
      <button onClick={handleSubmit} >Submit</button>
      <br></br>
      <p></p>
      <div className='output-area'>
      
       <h3> Output:</h3>
      <p>{status}</p>
      { <p>{jobId && `JobID: ${jobId}`}</p> }
      <p>{output}</p>
      <p>{renderTimeDetails()}</p>
      </div>
      
    </div>
    
  );
}

export default App;
