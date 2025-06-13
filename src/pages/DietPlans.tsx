
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

const DietPlans = () => {
  const { toast } = useToast();
  const [dietPlans, setDietPlans] = useLocalStorage('dietPlans', [
    {
      id: 1,
      packageName: 'Diabetic Diet Package',
      dietType: 'Therapeutic',
      rate: 350,
      breakfast: {
        morning: 'Oats - 100g, Milk - 200ml',
        afternoon: 'Apple - 1 piece, Green Tea - 1 cup'
      },
      lunch: 'Brown Rice - 150g, Dal - 100g, Vegetables - 150g, Salad - 50g',
      dinner: 'Roti - 2 pieces, Grilled Chicken - 100g, Curry - 100g',
      totalRate: 350,
      createdDate: '2025-06-09'
    },
    {
      id: 2,
      packageName: 'Regular Diet Package',
      dietType: 'Regular',
      rate: 250,
      breakfast: {
        morning: 'Bread - 2 slices, Butter - 10g, Tea - 1 cup',
        afternoon: 'Biscuits - 2 pieces, Milk - 150ml'
      },
      lunch: 'Rice - 200g, Curry - 150g, Vegetables - 100g, Dal - 100g',
      dinner: 'Roti - 3 pieces, Dal - 100g, Curd - 100g, Pickle - 10g',
      totalRate: 250,
      createdDate: '2025-06-09'
    }
  ]);

  const [formData, setFormData] = useState({
    packageName: '',
    dietType: 'Regular',
    rate: '',
    breakfast: '',
    lunch: '',
    evening: '',
    dinner: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const currentDate = new Date().toISOString().split('T')[0];
  const [fromDate, setFromDate] = useState(currentDate);
  const [toDate, setToDate] = useState(currentDate);
  const [typeFilter, setTypeFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const filteredPlans = useMemo(() => {
    return dietPlans.filter(plan => {
      const matchesSearch = plan.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           plan.dietType.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'All' || plan.dietType === typeFilter;
      
      const planDate = new Date(plan.createdDate);
      const fromDateObj = new Date(fromDate);
      const toDateObj = new Date(toDate);
      const matchesDate = planDate >= fromDateObj && planDate <= toDateObj;
      
      return matchesSearch && matchesType && matchesDate;
    });
  }, [dietPlans, searchTerm, typeFilter, fromDate, toDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPlan) {
      const updatedPlans = dietPlans.map(plan => 
        plan.id === editingPlan.id 
          ? { 
              ...plan, 
              packageName: formData.packageName,
              dietType: formData.dietType,
              rate: Number(formData.rate),
              breakfast: {
                morning: formData.breakfast,
                afternoon: formData.evening
              },
              lunch: formData.lunch,
              dinner: formData.dinner,
              totalRate: Number(formData.rate)
            }
          : plan
      );
      setDietPlans(updatedPlans);
      toast({ title: "Diet plan updated successfully!" });
    } else {
      const newPlan = {
        id: Date.now(),
        packageName: formData.packageName,
        dietType: formData.dietType,
        rate: Number(formData.rate),
        breakfast: {
          morning: formData.breakfast,
          afternoon: formData.evening
        },
        lunch: formData.lunch,
        dinner: formData.dinner,
        totalRate: Number(formData.rate),
        createdDate: new Date().toISOString().split('T')[0]
      };
      const updatedPlans = [...dietPlans, newPlan];
      setDietPlans(updatedPlans);
      toast({ title: "Diet plan added successfully!" });
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      packageName: '',
      dietType: 'Regular',
      rate: '',
      breakfast: '',
      lunch: '',
      evening: '',
      dinner: ''
    });
    setShowModal(false);
    setEditingPlan(null);
  };

  const handleEdit = (plan: any) => {
    setFormData({
      packageName: plan.packageName,
      dietType: plan.dietType,
      rate: plan.rate.toString(),
      breakfast: plan.breakfast.morning,
      lunch: plan.lunch,
      evening: plan.breakfast.afternoon,
      dinner: plan.dinner
    });
    setEditingPlan(plan);
    setShowModal(true);
  };

  const handleDelete = (planId: number) => {
    const updatedPlans = dietPlans.filter(plan => plan.id !== planId);
    setDietPlans(updatedPlans);
    toast({ title: "Diet plan deleted successfully!" });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Package Name,Diet Type,Breakfast,Lunch,Evening,Dinner,Total Rate\n"
      + filteredPlans.map(plan => 
          `${plan.packageName},${plan.dietType},"${plan.breakfast.morning}","${plan.lunch}","${plan.breakfast.afternoon}","${plan.dinner}",${plan.totalRate}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "diet_plans.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <h1 className="text-xl font-semibold mb-1" style={{ color: '#0d92ae' }}>Diet Package Management</h1>
              <p className="text-gray-600 text-sm">Date Wise Diet Package Management Report Details</p>
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
                  <option>Diet Package</option>
                </select>
              </div> */}
              <div>
                <Label htmlFor="filter" className="text-sm font-medium text-gray-700">Diet Type</Label>
                <select 
                  id="filter" 
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="mt-1 w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option>All</option>
                  <option>Regular</option>
                  <option>Specialized</option>
                  <option>Therapeutic</option>
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
                <Plus className="w-4 h-4 mr-2" />Add Diet Package
              </Button>
              <div className="flex items-center gap-2">
                <Label htmlFor="search" className="text-sm font-medium">Search:</Label>
                <Input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48"
                  placeholder="Search diet packages..."
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
                  <TableHead>Package Name</TableHead>
                  <TableHead>Diet Type</TableHead>
                  <TableHead>Breakfast</TableHead>
                  <TableHead>Lunch</TableHead>
                  <TableHead>Evening</TableHead>
                  <TableHead>Dinner</TableHead>
                  <TableHead>Total Rate (₹)</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map((plan, index) => (
                  <TableRow key={plan.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium" style={{ color: '#0d92ae' }}>{plan.packageName}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        plan.dietType === 'Regular' ? 'bg-blue-100 text-blue-800' :
                        plan.dietType === 'Specialized' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {plan.dietType}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{plan.breakfast.morning}</TableCell>
                    <TableCell className="text-sm">{plan.lunch}</TableCell>
                    <TableCell className="text-sm">{plan.breakfast.afternoon}</TableCell>
                    <TableCell className="text-sm">{plan.dinner}</TableCell>
                    <TableCell className="font-semibold">₹{plan.totalRate}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(plan)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(plan.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Modal */}
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPlan ? 'Edit Diet Package' : 'Add New Diet Package'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="packageName">Diet Package Name</Label>
                    <Input
                      id="packageName"
                      value={formData.packageName}
                      onChange={(e) => setFormData({...formData, packageName: e.target.value})}
                      placeholder="Enter package name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dietType">Diet Type</Label>
                    <select
                      id="dietType"
                      value={formData.dietType}
                      onChange={(e) => setFormData({...formData, dietType: e.target.value})}
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Regular">Regular</option>
                      <option value="Specialized">Specialized</option>
                      <option value="Therapeutic">Therapeutic</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="rate">Rate (₹)</Label>
                    <Input
                      id="rate"
                      type="number"
                      value={formData.rate}
                      onChange={(e) => setFormData({...formData, rate: e.target.value})}
                      placeholder="Package cost"
                      required
                    />
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="breakfast" className="text-gray-700">Breakfast Items & Quantity</Label>
                      <Input
                        id="breakfast"
                        value={formData.breakfast}
                        onChange={(e) => setFormData({...formData, breakfast: e.target.value})}
                        placeholder="e.g., Oats - 100g, Milk - 200ml"
                        className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="evening" className="text-gray-700">Evening Items & Quantity</Label>
                      <Input
                        id="evening"
                        value={formData.evening}
                        onChange={(e) => setFormData({...formData, evening: e.target.value})}
                        placeholder="e.g., Apple - 1 piece, Tea - 1 cup"
                        className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lunch" className="text-gray-700">Lunch Items & Quantity</Label>
                    <Input
                      id="lunch"
                      value={formData.lunch}
                      onChange={(e) => setFormData({...formData, lunch: e.target.value})}
                      placeholder="e.g., Rice - 200g, Dal - 100g, Vegetables - 150g"
                      className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dinner" className="text-gray-700">Dinner Items & Quantity</Label>
                    <Input
                      id="dinner"
                      value={formData.dinner}
                      onChange={(e) => setFormData({...formData, dinner: e.target.value})}
                      placeholder="e.g., Roti - 2 pieces, Curry - 100g"
                      className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                {/* Days Available */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Days Available</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <div key={day} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`day-${day}`}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`day-${day}`} className="ml-2 block text-sm text-gray-700">
                          {day}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetForm}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="text-white hover:bg-blue-600 transition-colors" 
                    style={{ backgroundColor: '#37a9be' }}
                  >
                    {editingPlan ? 'Update Diet Package' : 'Add Diet Package'}
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

export default DietPlans;
