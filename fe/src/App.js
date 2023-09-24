import React from 'react'
import {RouterProvider} from 'react-router-dom'
import { appRoutes } from './routes/index'


function App() {
  return (
    <RouterProvider router={appRoutes}/>
  );
}

export default App;
