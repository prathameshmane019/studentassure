"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'sonner'
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function RegisterPage() {
  const [department, setDepartment] = useState('');
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({
    department: '',
    username: '',
    password: '',
    classes: []
  });

  const [departmentToUpdate, setDepartmentToUpdate] = useState(null);

  useEffect(() => {
    // Pre-fill form if department is selected for update
    if (departmentToUpdate) {
      setForm({
        department: departmentToUpdate.department,
        username: departmentToUpdate.username,
        password: departmentToUpdate.password,
        classes: departmentToUpdate.classes.join(',')
      });
    }
  }, [departmentToUpdate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleClassesChange = (e) => {
    const { value } = e.target;
    setClasses(value.split(',').map(cls => cls.trim()));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedDepartment = {
      ...form,
      department: department
    };
    try {
      if (departmentToUpdate) {
        await axios.put(`/api/department/${departmentToUpdate._id}`, updatedDepartment);
        toast.success('Department updated successfully');
      } else {
        await axios.post('/api/department/register', updatedDepartment);
        toast.success('Department registered successfully');
      }
    } catch (error) {
      console.error('Error updating/registering department:', error);
      toast.error('Failed to update/register department');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Department</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader></DialogHeader>
        <DialogTitle>{departmentToUpdate ? 'Update Department' : 'Register Department'}</DialogTitle>
        <DialogDescription>
          <form onSubmit={handleSubmit} className="w-full max-w-sm">
            <div className="md:flex md:items-center mb-6">
              {/* Department Selection */}
              <div className="md:w-1/3">
                <label htmlFor="department" className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                  Department
                </label>
              </div>
              <div className="md:w-2/3">
                <Select id="department" defaultValue={form.department} onValueChange={(value) => setDepartment(value)}>
                  <SelectTrigger className="">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ENTC">ENTC</SelectItem>
                    <SelectItem value="CSE">CSE</SelectItem>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="First Year">First Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Classes Input */}
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label htmlFor="classes" className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                  Classes (comma-separated)
                </label>
              </div>
              <div className="md:w-2/3">
                <input id="classes" value={classes.join(',')} onChange={handleClassesChange} className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" />
              </div>
            </div>
            {/* Username Input */}
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label htmlFor="username" className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                  Username
                </label>
              </div>
              <div className="md:w-2/3">
                <input id="username" value={form.username} onChange={handleChange} className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" />
              </div>
            </div>
            {/* Password Input */}
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label htmlFor="password" className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                  Password
                </label>
              </div>
              <div className="md:w-2/3">
                <input type="password" id="password" value={form.password} onChange={handleChange} className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" />
              </div>
            </div>
            {/* Action Buttons */}
            <div className="md:flex md:items-center">
              <div className="md:w-1/3"></div>
              <div className="md:w-2/3">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
                <Button type="submit">
                  {departmentToUpdate ? 'Update' : 'Register'}
                </Button>
              </div>
            </div>
          </form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
