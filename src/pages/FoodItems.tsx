
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

const FoodItems = () => {
  const { toast } = useToast();
  const [foodItems, setFoodItems] = useLocalStorage('foodItems', [
    {
      id: 1,
      name: 'Brown Rice',
      type: 'Vegetarian',
      unit: 'grams',
      calories: 112,
      fat: 0.9,
      carbs: 23,
      protein: 2.6,
      rate: 15,
      daysAvailable: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      createdDate: '2025-06-09'
    },
    {
      id: 2,
      name: 'Grilled Chicken',
      type: 'Non-Vegetarian',
      unit: 'grams',
      calories: 165,
      fat: 3.6,
      carbs: 0,
      protein: 31,
      rate: 45,
      daysAvailable: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      createdDate: '2025-06-09'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Vegetarian',
    unit: 'grams',
    calories: '',
    fat: '',
    carbs: '',
    protein: '',
    rate: '',
    daysAvailable: []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const currentDate = new Date().toISOString().split('T')[0];
  const [fromDate, setFromDate] = useState(currentDate);
  const [toDate, setToDate] = useState(currentDate);
  const [typeFilter, setTypeFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const filteredItems = useMemo(() => {
    return foodItems.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.daysAvailable.some(day => day.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = typeFilter === 'All' || item.type === typeFilter;
      
      const itemDate = new Date(item.createdDate);
      const fromDateObj = new Date(fromDate);
      const toDateObj = new Date(toDate);
      const matchesDate = itemDate >= fromDateObj && itemDate <= toDateObj;
      
      return matchesSearch && matchesType && matchesDate;
    });
  }, [foodItems, searchTerm, typeFilter, fromDate, toDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure numeric fields are properly converted to numbers
    const numericFields = {
      calories: Number(formData.calories) || 0,
      fat: Number(formData.fat) || 0,
      carbs: Number(formData.carbs) || 0,
      protein: Number(formData.protein) || 0,
      rate: Number(formData.rate) || 0
    };

    if (editingItem) {
      setFoodItems(prevItems => 
        prevItems.map(item => 
          item.id === editingItem.id 
            ? { 
                ...item,
                ...formData,
                ...numericFields,
                daysAvailable: formData.daysAvailable
              }
            : item
        )
      );
      toast({ title: "Food item updated successfully!" });
    } else {
      const newItem = {
        id: Date.now(),
        name: formData.name,
        type: formData.type,
        unit: formData.unit,
        ...numericFields,
        daysAvailable: formData.daysAvailable,
        createdDate: new Date().toISOString().split('T')[0]
      };
      setFoodItems(prevItems => [...prevItems, newItem]);
      toast({ title: "Food item added successfully!" });
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'Vegetarian',
      unit: 'grams',
      calories: '',
      fat: '',
      carbs: '',
      protein: '',
      rate: '',
      daysAvailable: []
    });
    setShowModal(false);
    setEditingItem(null);
  };

  const handleEdit = (item: any) => {
    setFormData({
      name: item.name,
      type: item.type,
      unit: item.unit,
      calories: item.calories.toString(),
      fat: item.fat.toString(),
      carbs: item.carbs.toString(),
      protein: item.protein.toString(),
      rate: item.rate.toString(),
      daysAvailable: item.daysAvailable
    });
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = (itemId: number) => {
    setFoodItems(foodItems.filter(item => item.id !== itemId));
    toast({ title: "Food item deleted successfully!" });
  };

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      daysAvailable: prev.daysAvailable.includes(day)
        ? prev.daysAvailable.filter(d => d !== day)
        : [...prev.daysAvailable, day]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Food Name,Type,Unit,Calories,Fat,Carbs,Protein,Rate,Days Available\n"
      + filteredItems.map(item => 
          `${item.name},${item.type},${item.unit},${item.calories},${item.fat},${item.carbs},${item.protein},${item.rate},"${item.daysAvailable.join(', ')}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "food_items.csv");
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
              <h1 className="text-xl font-semibold mb-1" style={{ color: '#0d92ae' }}>Food Item Management</h1>
              <p className="text-gray-600 text-sm">Manage hospital food items and their nutritional information</p>
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
                <Label htmlFor="output" className="text-sm font-medium text-gray-700">Output</Label>
                <select id="output" className="mt-1 w-full h-10 px-3 py-2 border border-gray-300 rounded-md">
                  <option>Food Items</option>
                </select>
              </div> */}
              <div>
                <Label htmlFor="filter" className="text-sm font-medium text-gray-700">Food Type</Label>
                <select 
                  id="filter" 
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="mt-1 w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option>All</option>
                  <option>Vegetarian</option>
                  <option>Non-Vegetarian</option>
                  <option>High Calorie</option>
                  <option>Low Calorie</option>
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
              {/* <Button variant="outline" size="sm"><FileText className="w-4 h-4 mr-1" />CSV</Button> */}
              {/* <Button variant="outline" size="sm"><FileText className="w-4 h-4 mr-1" />PDF</Button> */}
              <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="w-4 h-4 mr-1" />Print</Button>
            </div>
            
            <div className="flex items-center gap-4">
              <Button onClick={() => setShowModal(true)} className="text-white" style={{ backgroundColor: '#37a9be' }}>
                <Plus className="w-4 h-4 mr-2" />Add Food Item
              </Button>
              <div className="flex items-center gap-2">
                <Label htmlFor="search" className="text-sm font-medium">Search:</Label>
                <Input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48"
                  placeholder="Search Food Name, Type"
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
                  <TableHead>Food Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Calories</TableHead>
                  <TableHead>Fat (g)</TableHead>
                  <TableHead>Carbs (g)</TableHead>
                  <TableHead>Protein (g)</TableHead>
                  <TableHead>Rate (₹)</TableHead>
                  <TableHead>Days Available</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium" style={{ color: '#0d92ae' }}>{item.name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.type === 'Vegetarian' ? 'bg-green-100 text-green-800' :
                        item.type === 'Non-Vegetarian' ? 'bg-red-100 text-red-800' :
                        item.type === 'High Calorie' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {item.type}
                      </span>
                    </TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{item.calories}</TableCell>
                    <TableCell>{item.fat}</TableCell>
                    <TableCell>{item.carbs}</TableCell>
                    <TableCell>{item.protein}</TableCell>
                    <TableCell>₹{item.rate}</TableCell>
                    <TableCell className="text-sm">{item.daysAvailable.join(', ')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
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
                <DialogTitle>{editingItem ? 'Edit Food Item' : 'Add New Food Item'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Food Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Food Type</Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Non-Vegetarian">Non-Vegetarian</option>
                      <option value="High Calorie">High Calorie</option>
                      <option value="Low Calorie">Low Calorie</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                      placeholder="e.g., grams, pieces, cups"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="rate">Rate (cost per unit)</Label>
                    <Input
                      id="rate"
                      type="number"
                      step="0.01"
                      value={formData.rate}
                      onChange={(e) => setFormData({...formData, rate: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h3 className="text-lg font-semibold mb-4 text-blue-900">Nutritional Information</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="calories">Calories</Label>
                      <Input
                        id="calories"
                        type="number"
                        step="0.1"
                        value={formData.calories}
                        onChange={(e) => setFormData({...formData, calories: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="fat">Fat (grams)</Label>
                      <Input
                        id="fat"
                        type="number"
                        step="0.1"
                        value={formData.fat}
                        onChange={(e) => setFormData({...formData, fat: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="carbs">Carbohydrates (grams)</Label>
                      <Input
                        id="carbs"
                        type="number"
                        step="0.1"
                        value={formData.carbs}
                        onChange={(e) => setFormData({...formData, carbs: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="protein">Protein (grams)</Label>
                      <Input
                        id="protein"
                        type="number"
                        step="0.1"
                        value={formData.protein}
                        onChange={(e) => setFormData({...formData, protein: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 bg-green-50">
                  <Label className="text-lg font-semibold text-green-900 mb-3 block">Days Available</Label>
                  <div className="grid grid-cols-7 gap-2">
                    {daysOfWeek.map((day) => (
                      <label key={day} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.daysAvailable.includes(day)}
                          onChange={() => handleDayToggle(day)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-green-800">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                  <Button type="submit" className="text-white" style={{ backgroundColor: '#37a9be' }}>
                    {editingItem ? 'Update Food Item' : 'Add Food Item'}
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

export default FoodItems;
