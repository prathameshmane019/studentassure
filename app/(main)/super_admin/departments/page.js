"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button";

const DepartmentManager = () => {
  const [departments, setDepartments] = useState([]);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    department: "",
    username: "",
    password: "",
    classes: "",
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("/api/department");
      setDepartments(response.data.filter(
        user => !user._id.startsWith("S")
      ));
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { classes, ...otherData } = formData;
      const classesArray = classes.split(",").map((cls) => cls.trim());
      const payload = { ...otherData, classes: classesArray };
      if (editingDepartment) {
        await axios.put(`/api/department/`, payload);
      } else {
        await axios.post("/api/department", payload);
      }
      setShowForm(false);
      fetchDepartments();
    } catch (error) {
      console.error("Error creating/updating department:", error);
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      department: department.department,
      username: department._id,
      password: department.password,
      classes: department.classes.join(", "),
    });
    setShowForm(true);
  };

  const deleteDepartment = async (departmentId) => {
    try {
      await axios.delete(`/api/department?_id=${departmentId}`);
      fetchDepartments();
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      department: "",
      username: "",
      password: "",
      classes: "",
    });
    setEditingDepartment(null);
    setShowForm(false);
  };

  return (
    <div className="mx-10 h-screen">
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">{editingDepartment ? "Update Department" : "Add Department"}</h2>
              <div className="mb-4">
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                <select
                  id="department"
                  value={formData.department}
                  onChange={handleChange}
                  name="department"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select a department</option>
                  <option value="ENTC">ENTC</option>
                  <option value="CSE">CSE</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Civil">Civil</option>
                  <option value="First Year">First Year</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  name="username"
                  required
                  variant="bordered"
                  className="mt-1 block w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  name="password"
                  required
                  variant="bordered"
                  className="mt-1 block w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="classes" className="block text-sm font-medium text-gray-700">Classes</label>
                <Input
                  id="classes"
                  type="text"
                  value={formData.classes}
                  onChange={handleChange}
                  name="classes"
                  required
                  variant="bordered"
                  className="mt-1 block w-full"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="mr-2">{editingDepartment ? "Update" : "Add"}</Button>
                <Button type="button" variant="error" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="">
        <h2 className="text-xl font-bold mb-4">Manage Department</h2>
        <div className="w-full flex justify-end">
          <Button onClick={() => setShowForm(true)}>Add Department</Button>
        </div>
        <Table  >
          <TableHeader>
          <TableRow >
            <TableHead>Department</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Password</TableHead>
            <TableHead>Classes</TableHead>
            <TableHead  className="">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="align-middle ">
            {departments && departments.map((department) => (
              <TableRow className="align-middle " key={department._id}>
                <TableCell>{department.department}</TableCell>
                <TableCell>{department._id}</TableCell>
                <TableCell>{department.password}</TableCell>
                <TableCell>{department.classes.join(", ")}</TableCell>
                <TableCell>
                  <Button className="m-2" onClick={() => handleEdit(department)}>Edit</Button>
                  <Button className="m-2 " onClick={() => deleteDepartment(department._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DepartmentManager;
