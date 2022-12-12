import { CircularProgress } from '@mui/material';
import React, { Component } from 'react';
import './LoadingComponent.css';

export default class Loading extends Component {
  render() {
    return (
        <div className='loading'>
            <CircularProgress />  
        </div>
    );
  }
} 