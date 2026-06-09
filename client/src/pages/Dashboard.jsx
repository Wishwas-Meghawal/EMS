import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { dummyAdminDashboardData, dummyEmployeeDashboardData } from '../assets/assets';
import Loading from '../components/Loading';
import EmployeeDashboard from '../components/EmployeeDashboard';
import AdminDashboard from '../components/AdminDashboard';

const Dashboard = () => {
  //  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  //  const [activeMenu, setActiveMenu] = useState('Dashboard');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);


  useEffect(()=>{
    setData(dummyEmployeeDashboardData);
    setTimeout(()=>{
      setLoading(false);
    }, 1000);
  },[]);

  if(loading) return <Loading/>
  if(!data) return <p className="text-red-500 py-12 text-center">Failed to load dashboard data </p>


  if(data.role === "ADMIN"){
    return <AdminDashboard data={data} />
  }else{
    return <EmployeeDashboard data={data} />
  }
};

export default Dashboard;