import React from "react";
import logoEp from '../assets/logo (1).png';
import { useNavigate, useLocation } from "react-router-dom";



const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const getHeading = () => {
        switch (location.pathname) {
            case '/dashboard/payrollForm':
                return 'Employee Payroll Form';
            case '/dashboard/payrollDetails':
                return 'Employee Payroll Details';
            default:
                return 'Dashboard';
        }
    };


    const handleClick =()=>{
        if(location.pathname === '/dashboard/payrollForm'){
            navigate("/dashboard/payrollDetails")
        }else{
            navigate("/dashboard/payrollForm")
        }
    }
    return (
        <header className="py-4 bg-gray-100 w-full">
            <div className="flex flex-row justify-start items-center w-full">
                <div className="flex flex-row justify-end items-center w-1/5 ">
                    
                        
                    <button type="submit" onClick={handleClick} className="flex items-center ml-30">
                    <img src={logoEp} alt="logo" className="mr-2" />
                        <div>
                            <span className="block text-lg font-bold text-green-600">EMPLOYEE</span>
                            <span className="block text-lg font-bold text-gray-700">PAYROLL</span>
                        </div>
                    </button>
                </div>
                <div >
                    <div className="text-blue-500 text-4xl ml-64 border-b-4">{getHeading()}</div>
                </div>
            </div>
        </header>
    );
};

export default Header;
