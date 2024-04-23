"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const DepartmentManager = () => {
  const [departments, setDepartments] = useState([]);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    department: '',
    username: '',
    password: '',
    classes: ''
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/department');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { classes, ...otherData } = formData;
      const classesArray = classes.split(',').map(cls => cls.trim());
      const payload = { ...otherData, classes: classesArray, department: formData.department }; // Include department in payload
      if (editingDepartment) {
        await axios.put(`/api/department/`, payload);
      } else {
        await axios.post('/api/department', payload);
      }
      resetForm();
      fetchDepartments();
    } catch (error) {
      console.error('Error creating/updating department:', error);
    }
  };

  const deleteDepartment = async (_id) => {
    try { 
      await axios.delete(`/api/department?_id=${_id}`);
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    console.log(formData);
    setFormData({
      department: department.department,
      username: department._id,
      password: department.password,
      classes: department.classes.join(', ')
    });
    setFormData(prevState => ({ ...prevState, department: department.department }));

  };

  const resetForm = () => {
    setFormData({
      department: '',
      username: '',
      password: '',
      classes: ''
    });
    setEditingDepartment(null);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="department">Department</label>
          <Select
            id="department"
            defaultValue={formData.department}
            onValueChange={(value) => setFormData(prevState => ({ ...prevState, department: value }))}
            name="department"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ENTC">ENTC</SelectItem>
              <SelectItem value="CSE">CSE</SelectItem>
              <SelectItem value="Mechanical">Mechanical</SelectItem>
              <SelectItem value="Electrial">Electrial</SelectItem>
              <SelectItem value="First Year">First Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <Input
            id="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            name="username"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            name="password"
            required
          />
        </div>
        <div>
          <label htmlFor="classes">Classes</label>
          <Input
            id="classes"
            type="text"
            value={formData.classes}
            onChange={handleChange}
            name="classes"
            required
          />
        </div>
        <Button type="submit">
          {editingDepartment ? 'Update' : 'Create'}
        </Button>
        {editingDepartment && (
          <Button type="button" onClick={resetForm}>
            Cancel
          </Button>
        )}
      </form>
      <div>
        <h2>Departments</h2>
        <ul>
          {departments.map((department) => (
            <li key={department._id}>
              {department.department}
              <Button onClick={() => handleEdit(department)}>Edit</Button>
              <Button onClick={() => deleteDepartment(department._id)}>Delete</Button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default DepartmentManager;
