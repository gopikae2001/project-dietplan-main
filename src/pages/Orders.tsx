import React, { useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Plus, Copy, FileSpreadsheet, FileText, Printer, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { useToast } from '../hooks/use-toast';
import { useLocalStorage } from '../hooks/useLocalStorage';

const Orders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useLocalStorage('dietOrders', [
    {
      id: 1,
      opCardNo: '100888889999448',
      patientName: 'Sajan',
      doctorName: 'Dr. Smith',
      sex: 'Male',
      age: '38 years',
      mobile: '1324847987',
      address: 'Kochi',
      dietPlan: 'Diabetic Diet Plan',
      status: 'pending',
      requestDate: '09/06/2025',
      rate: 350,
      notes: 'Patient is diabetic, requires low sugar diet',
      customizations: '',
      createdDate: '2025-06-09'
    },
    {
      id: 2,
      opCardNo: '25-26-25060017',
      patientName: 'Shajeer',
      doctorName: 'Dr. Johnson',
      sex: 'Male',
      age: '30 years',
      mobile: '1544877898',
      address: 'Ernakulam',
      dietPlan: 'Regular Diet Plan',
      status: 'approved',
      requestDate: '09/06/2025',
      rate: 250,
      notes: 'Standard recovery diet',
      customizations: '',
      createdDate: '2025-06-09'
    }
  ]);

  const [formData, setFormData] = useState({
    patientName: '',
    opCardNo: '',
    doctorName: '',
    sex: 'Male',
    age: '',
    mobile: '',
    address: '',
    dietPlan: '',
    notes: '',
    customizations: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const currentDate = new Date().toISOString().split('T')[0];
  const [fromDate, setFromDate] = useState(currentDate);
  const [toDate, setToDate] = useState(currentDate);
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [customizingOrder, setCustomizingOrder] = useState(null);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.opCardNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.dietPlan.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || order.status.toLowerCase() === statusFilter.toLowerCase();
      
      const orderDate = new Date(order.createdDate);
      const fromDateObj = new Date(fromDate);
      const toDateObj = new Date(toDate);
      const matchesDate = orderDate >= fromDateObj && orderDate <= toDateObj;
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchTerm, statusFilter, fromDate, toDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOrder) {
      const updatedOrders = orders.map(order => 
        order.id === editingOrder.id 
          ? { ...order, ...formData, id: editingOrder.id }
          : order
      );
      setOrders(updatedOrders);
      toast({ title: "Order updated successfully!" });
    } else {
      const newOrder = {
        id: Date.now(),
        ...formData,
        status: 'pending',
        requestDate: new Date().toLocaleDateString('en-GB'),
        rate: 300,
        customizations: '',
        createdDate: new Date().toISOString().split('T')[0]
      };
      const updatedOrders = [...orders, newOrder];
      setOrders(updatedOrders);
      toast({ title: "Diet order initiated by doctor successfully!" });
    }
    resetForm();
  };

  const handleCustomizeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customizingOrder) {
      const updatedOrders = orders.map(order => 
        order.id === customizingOrder.id 
          ? { ...order, customizations: formData.customizations, status: 'approved' }
          : order
      );
      setOrders(updatedOrders);
      toast({ title: "Diet plan customized and approved by dietitian!" });
      setShowCustomizeModal(false);
      setCustomizingOrder(null);
      setFormData({ ...formData, customizations: '' });
    }
  };

  const resetForm = () => {
    setFormData({
      patientName: '',
      opCardNo: '',
      doctorName: '',
      sex: 'Male',
      age: '',
      mobile: '',
      address: '',
      dietPlan: '',
      notes: '',
      customizations: ''
    });
    setShowModal(false);
    setEditingOrder(null);
  };

  const handleEdit = (order: any) => {
    setFormData({
      patientName: order.patientName,
      opCardNo: order.opCardNo,
      doctorName: order.doctorName,
      sex: order.sex,
      age: order.age,
      mobile: order.mobile,
      address: order.address,
      dietPlan: order.dietPlan,
      notes: order.notes,
      customizations: order.customizations || ''
    });
    setEditingOrder(order);
    setShowModal(true);
  };

  const handleDelete = (orderId: number) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    toast({ title: "Order deleted successfully!" });
  };

  const handleCustomize = (order: any) => {
    setCustomizingOrder(order);
    setFormData({ ...formData, customizations: order.customizations || '' });
    setShowCustomizeModal(true);
  };

  const handleApprove = (orderId: number) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: 'approved' } : order
    );
    setOrders(updatedOrders);
    toast({ title: "Diet plan approved by dietitian!" });
  };

  const handleSendToCafeteria = (orderId: number) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: 'in-cafeteria' } : order
    );
    setOrders(updatedOrders);
    toast({ title: "Order sent to cafeteria for meal preparation!" });
  };

  const handleComplete = (orderId: number) => {
    const order = orders.find(o => o.id === orderId);
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: 'completed' } : order
    );
    setOrders(updatedOrders);
    toast({ title: `Order completed! ₹${order?.rate} added to patient's bill.` });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "OP/Card No,Patient Name,Doctor,Sex,Age,Mobile,Address,Diet Plan,Status,Customizations\n"
      + filteredOrders.map(order => 
          `${order.opCardNo},${order.patientName},${order.doctorName},${order.sex},${order.age},${order.mobile},${order.address},${order.dietPlan},${order.status},"${order.customizations || ''}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "diet_orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'in-cafeteria': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionButtons = (order: any) => {
    const buttons = [];
    
    if (order.status === 'pending') {
      buttons.push(
        <Button 
          key="customize" 
          size="sm" 
          className="text-white mr-1" 
          style={{ backgroundColor: '#37a9be' }}
          onClick={() => handleCustomize(order)}
        >
          Customize
        </Button>
      );
      buttons.push(
        <Button 
          key="approve" 
          size="sm" 
          className="bg-green-600 hover:bg-green-700 mr-1"
          onClick={() => handleApprove(order.id)}
        >
          Approve
        </Button>
      );
    }
    
    if (order.status === 'approved') {
      buttons.push(
        <Button 
          key="cafeteria" 
          size="sm" 
          className="text-white mr-1" 
          style={{ backgroundColor: '#37a9be' }}
          onClick={() => handleSendToCafeteria(order.id)}
        >
          Send to Cafeteria
        </Button>
      );
    }
    
    if (order.status === 'in-cafeteria') {
      buttons.push(
        <Button 
          key="complete" 
          size="sm" 
          className="bg-green-600 hover:bg-green-700 mr-1"
          onClick={() => handleComplete(order.id)}
        >
          Complete & Bill
        </Button>
      );
    }
    
    buttons.push(
      <Button key="edit" variant="outline" size="sm" onClick={() => handleEdit(order)} className="mr-1">
        <Edit className="w-4 h-4" />
      </Button>
    );
    
    buttons.push(
      <Button key="delete" variant="outline" size="sm" onClick={() => handleDelete(order.id)}>
        <Trash2 className="w-4 h-4" />
      </Button>
    );
    
    return buttons;
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#d9e0e7', fontFamily: 'Poppins', fontSize: '12px' }}>
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <TopBar />
        
        <main className="flex-1 p-6">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-t-4 p-6" style={{ borderTopColor: '#0d92ae' }}>
              <h1 className="text-xl font-semibold mb-1" style={{ color: '#0d92ae' }}>Diet Order Management</h1>
              <p className="text-gray-600 text-sm">Workflow: Doctor → Dietitian → Cafeteria → Billing</p>
            </div>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <Label htmlFor="fromDate" className="text-sm font-medium text-gray-700">From Date</Label>
                <Input 
                  id="fromDate" 
                  type="date" 
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="mt-1" 
                />
              </div>
              <div>
                <Label htmlFor="toDate" className="text-sm font-medium text-gray-700">To Date</Label>
                <Input 
                  id="toDate" 
                  type="date" 
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="mt-1" 
                />
              </div>
              {/* <div>
                <Label htmlFor="output" className="text-sm font-medium text-gray-700">Type</Label>
                <select id="output" className="mt-1 w-full h-10 px-3 py-2 border border-gray-300 rounded-md">
                  <option>Diet Orders</option>
                </select>
              </div> */}
              <div>
                <Label htmlFor="filter" className="text-sm font-medium text-gray-700">Status Filter</Label>
                <select 
                  id="filter" 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="mt-1 w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option>All</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>In-Cafeteria</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>
            <Button className="text-white" style={{ backgroundColor: '#37a9be' }}>Go</Button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              {/* <Button variant="outline" size="sm"><Copy className="w-4 h-4 mr-1" />Copy</Button> */}
              <Button variant="outline" size="sm" onClick={handleExcel}><FileSpreadsheet className="w-4 h-4 mr-1" />Excel</Button>
              {/* <Button variant="outline" size="sm"><FileText className="w-4 h-4 mr-1" />PDF</Button> */}
              <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="w-4 h-4 mr-1" />Print</Button>
            </div>
            
            <div className="flex items-center gap-4">
              <Button onClick={() => setShowModal(true)} className="text-white" style={{ backgroundColor: '#37a9be' }}>
                <Plus className="w-4 h-4 mr-2" />Doctor Initiate Diet Order
              </Button>
              <div className="flex items-center gap-2">
                <Label htmlFor="search" className="text-sm font-medium">Search:</Label>
                <Input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48"
                  placeholder="Search orders..."
                />
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-lg shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sl</TableHead>
                  <TableHead>OP/Card No</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Diet Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Customizations</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order, index) => (
                  <TableRow key={order.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{order.opCardNo}</TableCell>
                    <TableCell className="font-medium" style={{ color: '#0d92ae' }}>{order.patientName}</TableCell>
                    <TableCell>{order.doctorName}</TableCell>
                    <TableCell>{order.dietPlan}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ')}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{order.customizations || '-'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {getActionButtons(order)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Main Modal */}
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingOrder ? 'Edit Diet Order' : 'Doctor Initiate Diet Order'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="opCardNo">OP/Card No</Label>
                    <Input
                      id="opCardNo"
                      value={formData.opCardNo}
                      onChange={(e) => setFormData({...formData, opCardNo: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="patientName">Patient Name</Label>
                    <Input
                      id="patientName"
                      value={formData.patientName}
                      onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="doctorName">Doctor Name</Label>
                    <Input
                      id="doctorName"
                      value={formData.doctorName}
                      onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="sex">Sex</Label>
                    <select
                      id="sex"
                      value={formData.sex}
                      onChange={(e) => setFormData({...formData, sex: e.target.value})}
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      placeholder="e.g., 38 years"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mobile">Mobile</Label>
                    <Input
                      id="mobile"
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="dietPlan">Diet Plan</Label>
                  <select
                    id="dietPlan"
                    value={formData.dietPlan}
                    onChange={(e) => setFormData({...formData, dietPlan: e.target.value})}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Diet Plan</option>
                    <option value="Regular Diet Plan">Regular Diet Plan</option>
                    <option value="Diabetic Diet Plan">Diabetic Diet Plan</option>
                    <option value="High Protein Diet">High Protein Diet</option>
                    <option value="Low Sodium Diet">Low Sodium Diet</option>
                    <option value="Cardiac Diet">Cardiac Diet</option>
                    <option value="Renal Diet">Renal Diet</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="notes">Medical Notes & History</Label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter medical history, allergies, special dietary requirements..."
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                  <Button type="submit" className="text-white" style={{ backgroundColor: '#37a9be' }}>
                    {editingOrder ? 'Update Order' : 'Submit Diet Request'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Customize Modal */}
          <Dialog open={showCustomizeModal} onOpenChange={setShowCustomizeModal}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Dietitian Customize Diet Plan</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCustomizeSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="customizations">Diet Plan Customizations</Label>
                  <textarea
                    id="customizations"
                    value={formData.customizations}
                    onChange={(e) => setFormData({...formData, customizations: e.target.value})}
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter dietary modifications, restrictions, special instructions..."
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button type="button" variant="outline" onClick={() => setShowCustomizeModal(false)}>Cancel</Button>
                  <Button type="submit" className="text-white" style={{ backgroundColor: '#37a9be' }}>
                    Customize & Approve
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default Orders;
