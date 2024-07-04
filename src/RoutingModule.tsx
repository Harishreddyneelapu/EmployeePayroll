import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Dashboard from './components/DashBoard';
import PayrollForm from './components/PayrollForm';
import PayrollDetails from './components/PayrollDetails';

function RoutingModule(){
    const AppRoutes = createBrowserRouter([
        {path:"",element:<Navigate to="/dashboard/payrollDetails"/>},
        {path:"/dashboard", element:<Dashboard/>,children:[
            {path:"payrollForm",element:<PayrollForm/>},
            {path:"payrollDetails",element:<PayrollDetails/>}
        ]}
    ])
    return <RouterProvider router={AppRoutes}></RouterProvider>
}
export default RoutingModule;