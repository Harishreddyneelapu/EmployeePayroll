import search from '../assets/search.png';
import add from '../assets/plus.png';
import profile1 from '../assets/profile1.png';
import profile2 from '../assets/profile2.png';
import profile3 from '../assets/profile3.png';
import profile4 from '../assets/profile4.png';
import deleteIcon from '../assets/delete.png';
import edit from '../assets/pencil.png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface StartDate {
    day: string;
    month: string;
    year: string;
}

interface Employee {
    id: string;
    name: string;
    profile: string;
    gender: string;
    dept: string[];
    salary: string;
    startDate: StartDate;
    notes: string;
}

const imageMap: { [key: string]: string } = {
    "profile1.png": profile1,
    "profile2.png": profile2,
    "profile3.png": profile3,
    "profile4.png": profile4
};

const PayrollDetails: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/dashboard/payrollForm');
    };

    useEffect(() => {
        fetch('http://localhost:8000/employees')
            .then(res => res.json())
            .then(data => {
                setEmployees(data);
            });
    }, []);

    return (
        <div className="flex flex-col">
            <div className="flex justify-between w-8/12 ml-60 mt-10">
                <div className="mb-4">
                    <h2 className="text-2xl font-bold">Employee Payroll Details</h2>
                </div>
                <div className='flex'>
                    <div><img src={search} alt='search' className="w-5 h-5 mr-4 mt-2" /></div>
                    <div>
                        <button className="bg-green-600 rounded-md text-white flex w-28 gap-2 h-9 items-center text-sm" onClick={handleClick}>
                            <img src={add} alt='add' className="w-4 h-4 ml-3 mr-1" />Add User
                        </button>
                    </div>
                </div>
            </div>
            <div className='w-8/12 ml-60'>
                <table className='table-auto w-full'>
                    <thead className='bg-gray-600 h-10 w-full text-left'>
                        <tr>
                            <th className='w-1/12 text-white'></th>
                            <th className='w-2/12 text-white'>Name</th>
                            <th className='w-2/12 text-white'>Gender</th>
                            <th className='w-2/12 text-white'>Department</th>
                            <th className='w-2/12 text-white'>Salary</th>
                            <th className='w-2/12 text-white'>Start Date</th>
                            <th className='w-1/12 text-white'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='bg-gray-100'>
                        { employees && employees.map(employee => (
                            <tr className='h-10' key={employee.id}>
                                <td><img alt='' className='w-5 h-5 ml-10' src={imageMap[employee.profile]} /></td>
                                <td>{employee.name}</td>
                                <td>{employee.gender}</td>
                                <td>{employee.dept.join(', ')}</td>
                                <td>{employee.salary}</td>
                                <td>{`${employee.startDate.day}-${employee.startDate.month}-${employee.startDate.year}`}</td>
                                <td>
                                    <div className='flex justify-start gap-6'>
                                        <div><img src={deleteIcon} alt='delete' className='w-4 h-4' /></div>
                                        <div><img src={edit} alt='edit' className='w-4 h-4' /></div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PayrollDetails;
