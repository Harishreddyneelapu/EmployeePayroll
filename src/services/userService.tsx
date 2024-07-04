import axios from 'axios';

const API_URL = 'http://localhost:8000/employees';

export interface Employee {
    id: string;
    name: string;
    profile: string;
    gender: string;
    dept: string[];
    salary: string;
    startDate: {
        day: string;
        month: string;
        year: string;
    };
    notes: string;
}


export const getAllEmployees = async (): Promise<Employee[]> => {
    const response = await axios.get<Employee[]>(API_URL);
    return response.data;
};


export const getEmployeeById = async (id: string): Promise<Employee> => {
    const response = await axios.get<Employee>(`${API_URL}/${id}`);
    return response.data;
};


export const createEmployee = async (employee: Employee): Promise<Employee> => {
    const response = await axios.post<Employee>(API_URL, employee);
    return response.data;
};


export const updateEmployee = async (id: string, employee: Employee): Promise<Employee> => {
    const response = await axios.put<Employee>(`${API_URL}/${id}`, employee);
    return response.data;
};


export const deleteEmployee = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};
