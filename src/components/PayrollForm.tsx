import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createEmployee, Employee } from '../services/userService';
import image1 from '../assets/profile1.png';
import image2 from '../assets/profile2.png';
import image3 from '../assets/profile3.png';
import image4 from '../assets/profile4.png';
import { useNavigate } from 'react-router-dom';


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

const generateUniqueId = (): string => {
    return Date.now().toString();
};

const EmployeePayrollForm: React.FC = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors },reset} = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        const employeeWithId: Employee = {
            ...data,
            id: generateUniqueId(),
        };

        try {
            const newEmployee: Employee = await createEmployee(employeeWithId);
            console.log('Employee created:', newEmployee);
            reset();
            navigate('/dashboard/payrollDetails');
            
        } catch (error) {
            console.error('Error creating employee:', error);
            
        }
    };
    return (
        <div className=" max-w-3xl mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full  px-16 py-4 shadow-2xl rounded-md">
                <div className="mb-4">
                    <h2 className="text-2xl font-bold">Employee Payroll Form</h2>
                </div>

                <div className="mb-6 flex items-center">
                    <label htmlFor="name" className="block text-sm font-medium w-1/4">Name</label>
                    <div className="flex-col ml-6 w-full">
                        <input id="name" type="text" {...register("name")} className="mt-1 block w-full h-8 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                        {errors.name && <p className="text-red-500 text-xs mt-1 w-full">{"name must have atleast 3 letters"}</p>}
                    </div>
                </div>

                <div className="mb-6 flex">
                    <label className="block text-sm font-medium w-1/4">Profile Image</label>
                    <div className="flex-col w-full ml-6">
                        <div className="flex space-x-4 w-2/3">
                            {[image1, image2, image3, image4].map((src, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <input type="radio" {...register("profile")} value={src} id={`profile-${index}`} />
                                    <label htmlFor={`profile-${index}`}>
                                        <img src={src} alt={`Profile ${index + 1}`} className="w-8 h-8" />
                                    </label>
                                </div>
                            ))}
                        </div>
                        {errors.profile && <p className="text-red-500 text-xs mt-1 w-full">{"you must have a profile image"}</p>}
                    </div>
                </div>

                <div className="mb-6 flex items-center">
                    <label className="block text-sm font-medium w-1/4">Gender</label>
                    <div className="flex-col w-full ml-6">
                        <div className="flex space-x-4 w-2/3">
                            {["Male", "Female"].map((gender, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <input type="radio" {...register("gender")} value={gender} id={`gender-${index}`} />
                                    <label htmlFor={`gender-${index}`} className="text-sm">{gender}</label>
                                </div>
                            ))}
                        </div>
                        {errors.gender && <p className="text-red-500 text-xs mt-1 w-full">{"you must select a gender"}</p>}
                    </div>
                </div>

                <div className="mb-6 flex items-center">
                    <label className="block text-sm font-medium w-1/4">Department</label>
                    <div className="flex flex-col w-full ml-6">
                        <div className="flex flex-wrap space-x-4 w-full">
                            {["HR", "Sales", "Finance", "Engineer", "Others"].map((dept, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <input type="checkbox" {...register("dept")} value={dept} id={`dept-${index}`} />
                                    <label htmlFor={`dept-${index}`} className="text-xs">{dept}</label>
                                </div>
                            ))}
                        </div>
                        {errors.dept && <p className="text-red-500 text-xs mt-1 w-full">{"select atleast one department"}</p>}
                    </div>
                </div>

                <div className="mb-6 flex items-center">
                    <label htmlFor="salary" className="block text-sm font-medium w-1/4">Salary</label>
                    <div className="flex-col w-3/4">
                        <select id="salary" {...register("salary")} className="mt-1 text-xs block w-1/4 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                            <option value="">select salary</option>
                            {Array.from({ length: 21 }, (_, i) => 30000 + i * 1000).map(salary => (
                                <option key={salary} value={String(salary)}>{salary}</option>
                            ))}
                        </select>
                        {errors.salary && <p className="text-red-500 text-xs mt-1 w-full">{"enter salary"}</p>}
                    </div>
                </div>

                <div className="mb-6 flex items-center">
                    <label className="block text-sm font-medium w-1/4">Start Date</label>
                    <div className="flex flex-col w-full ml-7">
                        <div className="flex space-x-2 w-2/3">
                            <select {...register("startDate.day")} className="block w-3/4 text-xs border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                <option value="">Day</option>
                                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                    <option key={day} value={String(day)}>{day}</option>
                                ))}
                            </select>
                            <select {...register("startDate.month")} className="block w-3/4 text-xs border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                <option value="">Month</option>
                                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => (
                                    <option key={index} value={month}>{month}</option>
                                ))}
                            </select>
                            <select {...register("startDate.year")} className="block w-3/4 text-xs border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
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
                        <textarea id="notes" {...register("notes")} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
                        {errors.notes && <p className="text-red-500 text-xs mt-1 w-full">{"Notes atleast have 3 characters"}</p>}
                    </div>
                </div>

                <div className="flex justify-between">
                    <button type="button" className="px-4 py-2 bg-gray-200 text-black rounded-md">Cancel</button>
                    <div className="space-x-4">
                        <button type="submit" className="px-4 py-2 bg-gray-200 text-black rounded-md">Submit</button>
                        <button type="reset" className="px-4 py-2 bg-gray-200 text-black rounded-md">Reset</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EmployeePayrollForm;
