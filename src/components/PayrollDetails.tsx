import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { deleteEmployee, getAllEmployees, getEmployeeById, updateEmployee } from '../services/userService';
import Modal from './Modal';
import { useNavigate } from 'react-router-dom';
import search from '../assets/search.png';
import deleteIcon from '../assets/delete.png';
import edit from '../assets/pencil.png';
import image1 from '../assets/profile1.png';
import image2 from '../assets/profile2.png';
import image3 from '../assets/profile3.png';
import image4 from '../assets/profile4.png';

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

const nameRegex = /^[A-Za-z]{3,}$/;
const notesRegex = /^.{3,}$/;

const schema = z.object({
    name: z.string().regex(nameRegex, { message: "Name must be at least 3 letters" }),
    profile: z.string(),
    gender: z.string(),
    dept: z.array(z.string()).min(1, { message: "Select at least one department" }),
    salary: z.string(),
    startDate: z.object({
        day: z.string(),
        month: z.string(),
        year: z.string(),
    }),
    notes: z.string().regex(notesRegex, { message: "Notes must be at least 3 characters" }),
});

type FormValues = z.infer<typeof schema>;

const departments = ["HR", "Sales", "Finance", "Engineer", "Others"];

const PayrollDetails: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [openEditForm, setOpenEditForm] = useState(false);
    const [id, setId] = useState('');
    const [originalEmployee, setOriginalEmployee] = useState<Employee | null>(null);
    const [name, setName] = useState('');
    const [profile, setProfile] = useState('');
    const [gender, setGender] = useState('');
    const [dept, setDept] = useState<string[]>([]);
    const [salary, setSalary] = useState('');
    const [startDate, setStartDate] = useState<StartDate>({ day: '', month: '', year: '' });
    const [notes, setNotes] = useState('');
    const [searchBarVisible, setSearchBarVisible] = useState(false);
    const [searchId, setSearchId] = useState('');
    const { register, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/dashboard/payrollForm');
    };

    const handleDelete = async (event: string, data: Employee) => {
        if (event === 'delete') {
            await deleteEmployee(data.id);
            setEmployees(employees.filter(employee => employee.id !== data.id));
        }
    }

    const handleEdit = (data: Employee) => {
        setOpenEditForm(true);
        setId(data.id);
        setName(data.name);
        setProfile(data.profile);
        setGender(data.gender);
        setDept(data.dept);
        setSalary(data.salary);
        setStartDate(data.startDate);
        setNotes(data.notes);
        setOriginalEmployee(data);
    }

    const updateData = async () => {

        await updateEmployee(id, {
            id,
            name,
            profile,
            gender,
            dept,
            salary,
            startDate,
            notes,
        });
        await fetchAllEmployees();
        setOpenEditForm(false);
    };

    const handleCancel = async () => {
        setOpenEditForm(false);
    }

    const fetchAllEmployees = async () => {
        try {
            const res = await getAllEmployees();
            setEmployees(res);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleReset = () => {
        if (originalEmployee) {
            // Reset form values to original employee data
            setName(originalEmployee.name);
            setProfile(originalEmployee.profile);
            setGender(originalEmployee.gender);
            setDept(originalEmployee.dept);
            setSalary(originalEmployee.salary);
            setStartDate(originalEmployee.startDate);
            setNotes(originalEmployee.notes);

            // Close the modal
            setOpenEditForm(false);
        }
    };

    const handleDeptChange = (dept: string) => {
        setDept(prevDept =>
            prevDept.includes(dept)
                ? prevDept.filter(d => d !== dept)
                : [...prevDept, dept]
        );
    };
    const handleSearch = async () => {
        if (searchId) {
            try {
                const result = await getEmployeeById(searchId);
                setSearchBarVisible(!searchBarVisible);
                setEmployees(employees.filter(employee => employee.id === result.id));

            } catch (error) {
                console.error('Error fetching employee:', error);
            }
        }
    };
    useEffect(() => {
        fetchAllEmployees();
    }, []);

    return (
        <div className="flex flex-col">
            <div className="flex justify-between w-8/12 ml-60 mt-10">
                <div className="mb-4">
                    <h2 className="text-2xl font-bold">Employee Payroll Details</h2>
                </div>
                <div className='flex'>
                    <div className="flex justify-end items-center w-full lg:w-auto mt-4 lg:mt-0">
                        {!searchBarVisible && (
                            <button onClick={() => setSearchBarVisible(true)}>
                                <img src={search} alt='search' className="w-5 h-5 mr-4 mb-3 " />
                            </button>
                        )}
                        {searchBarVisible && (
                            <div className="absolute w-3/12 ml-96  mb-4 mr-6 flex items-center">
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    placeholder="Enter employee ID..."
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                />
                                <button
                                    onClick={handleSearch}
                                    className="bg-blue-400 text-white p-2 rounded-md ml-2"
                                >
                                    Search
                                </button>
                            </div>
                        )}
                    </div>
                    <div>
                        <button className="bg-green-600 rounded-md text-white flex w-24 gap-2 h-9 items-center text-sm" onClick={handleClick}>
                            <p className=' ml-2 text-2xl'>+</p>Add User
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
                            <th className='w-1/12 text-white'>Gender</th>
                            <th className='w-4/12 text-white'>Department</th>
                            <th className='w-1/12 text-white'>Salary</th>
                            <th className='w-2/12 text-white'>Start Date</th>
                            <th className='w-1/12 text-white'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='bg-gray-100'>
                        {employees && employees.map(employee => (
                            <tr className='h-10' key={employee.id}>
                                <td><img alt='' className='w-5 h-5 ml-10' src={employee.profile} /></td>
                                <td>{employee.name}</td>
                                <td>{employee.gender}</td>
                                <td>
                                    <div>
                                        {employee.dept.map((dept, index) => (
                                            <div key={index} className='bg-yellow-100 inline-block mr-2 rounded-md px-2'>{dept}</div>
                                        ))}
                                    </div>
                                </td>
                                <td>{employee.salary}</td>
                                <td>{`${employee.startDate.day}-${employee.startDate.month}-${employee.startDate.year}`}</td>
                                <td>
                                    <div className='flex justify-start gap-6'>
                                        <div><button onClick={() => handleDelete('delete', employee)}><img src={deleteIcon} alt='delete' className='w-4 h-4' /></button></div>
                                        <div><button onClick={() => handleEdit(employee)}><img src={edit} alt='edit' className='w-4 h-4' /></button></div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={openEditForm}>
                <form className="w-full  px-16 py-4  shadow-2xl rounded-md">
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold">Employee Payroll Form</h2>
                    </div>
                    <div className="mb-6 flex items-center">
                        <label htmlFor="name" className="block text-sm font-medium w-1/4">Name</label>
                        <div className="flex-col w-3/4">
                            <input id="name" {...register("name")} value={name} onChange={(e) => setName(e.target.value)} type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                            {errors.name && <p className="text-red-500 text-xs mt-1 w-full">{errors.name.message}</p>}
                        </div>
                    </div>
                    <div className="mb-6 flex items-center">
                        <label className="block text-sm font-medium w-1/4">Profile</label>
                        <div className="flex-col w-3/4">
                            <div className="flex space-x-4">
                                {[image1, image2, image3, image4].map((src, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <input type="radio" {...register("profile")} value={src} id={`profile-${index}`} checked={src === profile} onChange={() => setProfile(src)} />
                                        <label htmlFor={`profile-${index}`}>
                                            <img src={src} alt={`Profile ${index + 1}`} className="w-8 h-8" />
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {errors.profile && <p className="text-red-500 text-xs mt-1 w-full">{errors.profile.message}</p>}
                        </div>
                    </div>
                    <div className="mb-6 flex items-center">
                        <label className="block text-sm font-medium w-1/4">Gender</label>
                        <div className="flex-col w-full ml-6">
                            <div className="flex space-x-4 w-2/3">
                                {["Male", "Female"].map((gender, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <input type="radio" {...register("gender")} value={gender} id={`gender-${index}`} checked={gender === gender} onChange={() => setGender(gender)} />
                                        <label htmlFor={`gender-${index}`} className="text-sm">{gender}</label>
                                    </div>
                                ))}
                            </div>
                            {errors.gender && <p className="text-red-500 text-xs mt-1 w-full">{errors.gender.message}</p>}
                        </div>
                    </div>
                    <div className="mb-6 flex items-center">
                        <label className="block text-sm font-medium w-1/4">Department</label>
                        <div className="flex flex-col w-full ml-6">
                            <div className="flex flex-wrap space-x-4 w-full">
                                {departments.map((dept, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <input type="checkbox" {...register("dept")} value={dept} id={`dept-${index}`} checked={dept.includes(dept)} onChange={() => handleDeptChange(dept)} />
                                        <label htmlFor={`dept-${index}`} className="text-xs">{dept}</label>
                                    </div>
                                ))}
                            </div>
                            {errors.dept && <p className="text-red-500 text-xs mt-1 w-full">{errors.dept.message}</p>}
                        </div>
                    </div>
                    <div className="mb-6 flex items-center">
                        <label htmlFor="salary" className="block text-sm font-medium w-1/4">Salary</label>
                        <div className="flex-col w-3/4">
                            <select id="salary" {...register("salary")} value={salary} onChange={(e) => setSalary(e.target.value)} className="mt-1 text-xs block w-1/4 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                <option value="">Select salary</option>
                                {Array.from({ length: 21 }, (_, i) => 30000 + i * 1000).map(salary => (
                                    <option key={salary} value={String(salary)}>{salary}</option>
                                ))}
                            </select>
                            {errors.salary && <p className="text-red-500 text-xs mt-1 w-full">{errors.salary.message}</p>}
                        </div>
                    </div>
                    <div className="mb-6 flex items-center">
                        <label className="block text-sm font-medium w-1/4">Start Date</label>
                        <div className="flex flex-col w-full ml-7">
                            <div className="flex space-x-2 w-2/3">
                                <select {...register("startDate.day")} value={startDate.day} onChange={(e) => setStartDate({ ...startDate, day: e.target.value })} className="block w-3/4 text-xs border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                    <option value="">Day</option>
                                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                        <option key={day} value={String(day)}>{day}</option>
                                    ))}
                                </select>
                                <select {...register("startDate.month")} value={startDate.month} onChange={(e) => setStartDate({ ...startDate, month: e.target.value })} className="block w-3/4 text-xs border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                    <option value="">Month</option>
                                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => (
                                        <option key={index} value={month}>{month}</option>
                                    ))}
                                </select>
                                <select {...register("startDate.year")} value={startDate.year} onChange={(e) => setStartDate({ ...startDate, year: e.target.value })} className="block w-3/4 text-xs border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                    <option value="">Year</option>
                                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                        <option key={year} value={String(year)}>{year}</option>
                                    ))}
                                </select>
                            </div>
                            {errors.startDate && (
                                <p className="text-red-500 text-xs mt-1 w-full">
                                    {errors.startDate.day?.message || errors.startDate.month?.message || errors.startDate.year?.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="mb-6 flex items-center">
                        <label htmlFor="notes" className="block text-sm font-medium w-1/4">Notes</label>
                        <div className="flex-col w-3/4">
                            <textarea id="notes" {...register("notes")} value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
                            {errors.notes && <p className="text-red-500 text-xs mt-1 w-full">{errors.notes.message}</p>}
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-400 text-black rounded-md">Cancel</button>
                        <div className="space-x-4">
                            <button type="submit" onClick={updateData} className="px-4 py-2 bg-gray-400 text-black rounded-md">Submit</button>
                            <button type="button" onClick={handleReset} className="px-4 py-2 bg-gray-400 text-black rounded-md">Reset</button>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default PayrollDetails;
