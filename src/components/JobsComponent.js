
  
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

  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const body = JSON.stringify({
      "limit": 10,
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
      return (
        (!filters.minExp || (job.minExp !== null && job.minExp?.toString().includes(filters.minExp))) &&
        (!filters.companyName || (job.companyName !== null && job.companyName?.toLowerCase().includes(filters.companyName.toLowerCase()))) &&
        (!filters.location || (job.location !== null && job.location?.toLowerCase().includes(filters.location.toLowerCase()))) &&
        (!filters.jobRole || (job.jobRole !== null && job.jobRole?.toLowerCase().includes(filters.jobRole.toLowerCase()))) &&
        (!filters.minJdSalary || (job.minJdSalary !== null && job.minJdSalary?.toString().includes(filters.minJdSalary)))
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
    return [...new Set(jobs.map((job) => job[value]).filter(x => x !== null && x !== undefined && x !== ''))];
};

  

  return (
    <> 
      <div className="filters">
      <Autocomplete
    options={uniqueValues('minExp').map(String)}
    value={filters.minExp || ''}
    onInputChange={(event, newValue) => handleFilterChange('minExp', newValue)}
    renderInput={(params) => <TextField {...params} label="Experience" />}
/>
<Autocomplete
    options={uniqueValues('minJdSalary').map(String)}
    value={filters.minJdSalary || ''}
    onInputChange={(event, newValue) => handleFilterChange('minJdSalary', newValue)}
    renderInput={(params) => <TextField {...params} label="Min Base Pay" />}
/>
        <Autocomplete
          options={uniqueValues('companyName')}
          onInputChange={(event, newValue) => handleFilterChange('companyName', newValue)}
          renderInput={(params) => <TextField {...params} label="Company Name" />}
        />
        <Autocomplete
          options={uniqueValues('location')}
          onInputChange={(event, newValue) => handleFilterChange('location', newValue)}
          renderInput={(params) => <TextField {...params} label="Location" />}
        />
        <Autocomplete
          options={uniqueValues('jobRole')}
          onInputChange={(event, newValue) => handleFilterChange('jobRole', newValue)}
          renderInput={(params) => <TextField {...params} label="Job Role" />}
        />
      
      </div>
      <div className="card-container">
        {filteredJobs.map((job, index) => (
          <div key={index}>
            <Card sx={{ maxWidth: 345 }}>
              <CardActionArea>
                <CardContent>
                <Typography gutterBottom variant="h5" component="div" 
    style={{
        whiteSpace: "nowrap", 
        overflow: "hidden", 
        textOverflow: "ellipsis"
    }}
    title={job.companyName || 'N/A'}
>Company Name: {job.companyName || 'N/A'}</Typography>
                  <Typography gutterBottom variant="h5" component="div">Location: {job.location || 'N/A'}</Typography>
                  <Typography gutterBottom variant="h5" component="div">Minimum Experience: {job.minExp || 'N/A'}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Job Details: {job.jobDetailsFromCompany?.substring(0, 100) || 'N/A'}...
                    {job.jobDetailsFromCompany && <Button size="small" onClick={() => handleExpandClick(job)}>Show More</Button>}
                  </Typography>
                </CardContent>
              </CardActionArea>
              {job.jdLink &&
                <CardActions>
                  <Button size="small" color="primary" >
                    <a href={job.jdLink} target="_blank" rel="noopener noreferrer">EASY APPLY</a>
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
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {selectedJob?.jobDetailsFromCompany || 'N/A'}
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
