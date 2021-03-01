import React, { FC } from 'react';
import './App.scss';
import Navbar from './components/Navbar';

type Props = {
  title: string;
}

export const App: FC<Props> = ({ title }) => {
  return (
    <div className="app">
      <Navbar />
      <div className="container">
        <h1>{title}</h1>
      </div>
    </div>
  );
}