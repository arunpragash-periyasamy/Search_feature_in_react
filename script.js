import React from 'react'
import ReactDOM from 'react-dom'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import App from './src/App'
import 'bootstrap/dist/css/bootstrap.css';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />
    }
])

ReactDOM.render(
    <RouterProvider router={router} />,
    document.getElementById('root')
)
