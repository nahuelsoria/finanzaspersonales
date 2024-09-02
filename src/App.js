import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Plus, Minus, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Button } from "./components/ui/button.jsx"
import { Input } from "./components/ui/input.jsx"
import { Label } from "./components/ui/label.jsx"
import { auth, db } from './firebase';
import { collection, addDoc, onSnapshot, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import Auth from './components/Auth';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const FinanzasApp = () => {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [user, setUser] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        console.log("Usuario autenticado:", user.uid);  // Verificar que el usuario esté autenticado
        const q = query(collection(db, 'transactions'), where('userId', '==', user.uid));
        onSnapshot(q, (snapshot) => {
          const transactionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setTransactions(transactionsData);
        });
      } else {
        setTransactions([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const newBalance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    setBalance(newBalance);
  }, [transactions]);

  const addTransaction = async (type) => {
  if (description && amount && user) {
    const newTransaction = {
      description,
      amount: type === 'ingreso' ? parseFloat(amount) : -parseFloat(amount),
      type,
      userId: user.uid,  // Asegúrate de que userId se esté estableciendo correctamente
      createdAt: new Date()
    };
    try {
      await addDoc(collection(db, 'transactions'), newTransaction);
      setDescription('');
      setAmount('');
    } catch (error) {
      console.error("Error al agregar la transacción:", error);
    }
  }
};

const updateTransaction = async () => {
  if (editingTransaction && description && amount) {
    const updatedTransaction = {
      ...editingTransaction,
      description,
      amount: parseFloat(amount),
    };
    try {
      const transactionRef = doc(db, 'transactions', editingTransaction.id);
      await updateDoc(transactionRef, updatedTransaction);
      setEditingTransaction(null);
      setDescription('');
      setAmount('');
    } catch (error) {
      console.error("Error al actualizar la transacción:", error);
    }
  }
};

const deleteTransaction = async (id) => {
  try {
    const transactionRef = doc(db, 'transactions', id);
    await deleteDoc(transactionRef);
  } catch (error) {
    console.error("Error al eliminar la transacción:", error);
  }
};

const groupedExpenses = transactions.reduce((acc, transaction) => {
  if (transaction.amount < 0) {
    const category = transaction.description.split(' ')[0];
    acc[category] = (acc[category] || 0) + Math.abs(transaction.amount);
  }
  return acc;
}, {});

const groupedIncomes = transactions.reduce((acc, transaction) => {
  if (transaction.amount > 0) {
    const category = transaction.description.split(' ')[0];
    acc[category] = (acc[category] || 0) + transaction.amount;
  }
  return acc;
}, {});

const pieDataExpenses = Object.entries(groupedExpenses).map(([name, value], index) => ({
  name,
  value,
  color: COLORS[index % COLORS.length]
}));

const pieDataIncomes = Object.entries(groupedIncomes).map(([name, value], index) => ({
  name,
  value,
  color: COLORS[index % COLORS.length]
}));

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Gestión de Finanzas Personales</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingTransaction ? 'Editar Transacción' : 'Nueva Transacción'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Comida, Salario, etc."
            />
            <Label htmlFor="amount">Monto</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
            <div className="flex space-x-2">
              <Button onClick={editingTransaction ? updateTransaction : () => addTransaction('ingreso')} className="flex-1">
                <Plus className="mr-2 h-4 w-4" /> {editingTransaction ? 'Actualizar' : 'Ingreso'}
              </Button>
              <Button onClick={editingTransaction ? updateTransaction : () => addTransaction('gasto')} variant="destructive" className="flex-1">
                <Minus className="mr-2 h-4 w-4" /> {editingTransaction ? 'Actualizar' : 'Gasto'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

        <Card>
          <CardHeader>
            <CardTitle>Balance Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{balance.toFixed(2)} $</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Nueva Transacción</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej: Comida, Salario, etc."
              />
              <Label htmlFor="amount">Monto</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
              <div className="flex space-x-2">
                <Button onClick={() => addTransaction('ingreso')} className="flex-1">
                  <Plus className="mr-2 h-4 w-4" /> Ingreso
                </Button>
                <Button onClick={() => addTransaction('gasto')} variant="destructive" className="flex-1">
                  <Minus className="mr-2 h-4 w-4" /> Gasto
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
  <CardHeader>
    <CardTitle>Últimas Transacciones</CardTitle>
  </CardHeader>
  <CardContent>
    <ul className="space-y-2">
      {transactions.slice(-5).reverse().map((transaction) => (
        <li key={transaction.id} className="flex justify-between items-center">
          <span>{transaction.description}</span>
          <span className={transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}>
            {transaction.amount.toFixed(2)} $
          </span>
          <div className="flex space-x-2">
            <Button onClick={() => setEditingTransaction(transaction)}>Editar</Button>
            <Button onClick={() => deleteTransaction(transaction.id)} variant="destructive">Eliminar</Button>
          </div>
        </li>
      ))}
    </ul>
  </CardContent>
</Card>

      <Card>
        <CardHeader>
          <CardTitle>Distribución de Gastos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieDataExpenses}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieDataExpenses.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distribución de Ingresos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieDataIncomes}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#82ca9d"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieDataIncomes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </div>
  );
};

export default FinanzasApp;