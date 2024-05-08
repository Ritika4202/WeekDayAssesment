
  
import React, { useState, useEffect } from 'react';
import { Autocomplete } from '@mui/material';
import { Card, CardContent, Typography, Button, CardActionArea, CardActions, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@mui/material';
import './JobsComponent.css';

function JobsComponent() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({
    minExp: '',
    companyName: '',
    location: '',
    jobRole:"",
    minJdSalary:"",
  });
  const salaryOptions = Array.from({length: 21}, (_, i) => `${i*5}-${(i+1)*5}`);
  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const body = JSON.stringify({
      "limit": 100,
      "offset": 0
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body
    };

    fetch("https://api.weekday.technology/adhoc/getSampleJdJSON", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setJobs(result.jdList);
        console.log(result.jdList);
        setFilteredJobs(result.jdList);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    let newFilteredJobs = jobs.filter((job) => {
      let inRange = false;
      if (filters.minJdSalary) {
        const [min, max] = filters.minJdSalary.split('-');
        inRange = job.minJdSalary >= min && job.minJdSalary <= max;
      }
      return (
        (!filters.minExp || (job.minExp !== null && job.minExp?.toString().includes(filters.minExp))) &&
        (!filters.companyName || (job.companyName !== null && job.companyName?.toLowerCase().includes(filters.companyName.toLowerCase()))) &&
        (!filters.location || (job.location !== null && job.location?.toLowerCase().includes(filters.location.toLowerCase()))) &&
        (!filters.jobRole || (job.jobRole !== null && job.jobRole?.toLowerCase().includes(filters.jobRole.toLowerCase()))) &&
        (!filters.minJdSalary || (job.minJdSalary !== null && inRange))
      );
    });
    setFilteredJobs(newFilteredJobs);
  }, [filters, jobs]);

  const handleFilterChange = (event, newValue) => {
    if (newValue !== null) {
        setFilters({
            ...filters,
            [event]: newValue
        });
    }
};


  const handleExpandClick = job => {
    setSelectedJob(job);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const uniqueValues = (value) => {
    return [...new Set(jobs.map((job) => job[value] !== null ? job[value]  : null).filter(x => x !== null && x !== undefined && x !== ''))];
  };

  

  return (
    <> 
     <div className="filters">
  <div className="filters-row">
    <div className="filter">
      <Autocomplete
        options={uniqueValues('minExp').map(String).sort((a, b) => a - b)}
        value={filters.minExp || ''}
        onInputChange={(event, newValue) => handleFilterChange('minExp', newValue)}
        renderInput={(params) => <TextField {...params} label="Experience" />}
        renderOption={(props, option) => <li {...props}>{option} years</li>}
      />
    </div>
    <div className="filter">
    <Autocomplete
  options={salaryOptions}
  value={filters.minJdSalary || ''}
  onInputChange={(event, newValue) => handleFilterChange('minJdSalary', newValue)}
  renderInput={(params) => <TextField {...params} label="Min Base Pay" />}
  renderOption={(props, option) => <li {...props}>{option} lakhs</li>}
/>
    </div>
    <div className="filter">
      <Autocomplete
        options={uniqueValues('companyName')}
        onInputChange={(event, newValue) => handleFilterChange('companyName', newValue)}
        renderInput={(params) => <TextField {...params} label="Company Name" />}
      />
    </div>
  </div>
  <div className="filters-row">
    <div className="filter">
      <Autocomplete
        options={uniqueValues('location')}
        onInputChange={(event, newValue) => handleFilterChange('location', newValue)}
        renderInput={(params) => <TextField {...params} label="Location" />}
      />
    </div>
    <div className="filter">
      <Autocomplete
        options={uniqueValues('jobRole')}
        onInputChange={(event, newValue) => handleFilterChange('jobRole', newValue)}
        renderInput={(params) => <TextField {...params} label="Job Role" />}
      />
    </div>
  </div>
</div>

      <div className="card-container">
  {filteredJobs.map((job, index) => (
    <div key={index}>
      <Card  sx={{ maxWidth: 345 }}>
        <CardActionArea>
          <CardContent>
            <Typography  component="div" 
              style={{
                fontFamily: "Lexend",
                fontSize: '13px',
    fontWeight: '600',
    letterSpacing:' 1px',
    marginBottom: '3px',
    color: '#8b8b8b',
                  whiteSpace: "nowrap", 
                  overflow: "hidden", 
                  textOverflow: "ellipsis"
              }}
              title={job.companyName || 'N/A'}
            >
             
             <img src={job.logoUrl}  style={{ width: '30px', marginRight: '10px' }}/>
              {job.companyName|| 'N/A'}
        
            </Typography>
            <Typography  style={{
                fontFamily: "Lexend",
                fontSize: '14px',
    lineHeight: '1.5',
                
              }} component="div">Location: {job.location.toUpperCase() || 'N/A'}</Typography>
           
            <Typography style={{
                fontFamily: "Lexend",
                
              }}variant="body2" color="text.secondary">
              <b>About Company:</b> {job.jobDetailsFromCompany?.substring(0, 100) || 'N/A'}...
              {job.jobDetailsFromCompany && <Button size="small" onClick={() => handleExpandClick(job)}>View Job</Button>}
            </Typography>
            <Typography style={{
                fontFamily: "Lexend",
                fontSize: '13px',
    fontWeight: '600',
    letterSpacing: '1px',
    marginbottom: '3px',
    color: '#8b8b8b',
              }}  component="div">Minimum Experience:</Typography>
                <Typography style={{
                fontFamily: "Lexend",
                fontSize: '14px',
    lineHeight: '1.5',
              }}  component="div">{job.minExp ? job.minExp + ' years' : 'N/A'}</Typography>
          </CardContent>
        </CardActionArea>
        {job.jdLink &&
          <CardActions>
            <Button size="small"  fullWidth style={{backgroundColor: 'rgb(85,239,196)', color: 'black',texfontFamily: "Lexend"}}>
              <a href={job.jdLink} target="_blank" rel="noopener noreferrer" className="apply-link">⚡ Easy Apply</a>
            </Button>
          </CardActions>}
          
      </Card>
    </div>
  ))}
</div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Job Details"}</DialogTitle>
        <DialogContent style={{
                fontFamily: "Lexend",
                
              }}>
          <DialogContentText id="alert-dialog-description">
            {selectedJob?.jobDetailsFromCompany || 'N/A'}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
          <b>Job Role: </b> {selectedJob?.jobRole.toUpperCase()||'N/A'}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
          <b>Minimum Base Pay: </b> {selectedJob?.minJdSalary||'N/A'}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
          <b>Maximum Base Pay: </b> {selectedJob?.maxJdSalary||'N/A'}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
          <b>Maximum Experience: </b> {selectedJob?.maxExp||'N/A'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default JobsComponent;