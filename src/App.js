import React, { useState, useEffect, useContext } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Plus, Minus, CreditCard, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button.jsx";
import { Input } from "./components/ui/input.jsx";
import { Label } from "./components/ui/label.jsx";
import { auth, db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import Auth from "./components/Auth";
import { motion } from "framer-motion";
import { ThemeContext } from "./ThemeContext.js";
import ThemeToggle from "./components/ui/ThemeToggle.jsx";
import Select from "./components/ui/Select.jsx";
import BalanceCard from "./components/ui/BalanceCard.jsx";
import Pagination from "./components/ui/Pagination.jsx";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const CATEGORIES = [
  "Alimentación",
  "Transporte",
  "Vivienda",
  "Entretenimiento",
  "Salud",
  "Educación",
  "Ropa",
  "Ingresos",
  "Otros",
];

const FinanzasApp = () => {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [user, setUser] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);

  const { isDarkMode } = useContext(ThemeContext);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        console.log("Usuario autenticado:", user.uid); // Verificar que el usuario esté autenticado
        const q = query(
          collection(db, "transactions"),
          where("userId", "==", user.uid)
        );
        onSnapshot(q, (snapshot) => {
          const transactionsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTransactions(transactionsData);
        });
      } else {
        setTransactions([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const newBalance = transactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    );
    setBalance(newBalance);
  }, [transactions]);

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setDescription(transaction.description);
    setAmount(Math.abs(transaction.amount).toString());
    setCategory(transaction.category);
  };

  const addOrUpdateTransaction = async (type) => {
    if (description && amount && category && user) {
      const transactionData = {
        description,
        amount: type === "ingreso" ? parseFloat(amount) : -parseFloat(amount),
        category,
        type,
        userId: user.uid,
        createdAt: new Date(),
      };

      try {
        if (editingTransaction) {
          // Actualizar transacción existente
          const transactionRef = doc(db, "transactions", editingTransaction.id);
          await updateDoc(transactionRef, transactionData);
          setEditingTransaction(null);
        } else {
          // Agregar nueva transacción
          await addDoc(collection(db, "transactions"), transactionData);
        }
        setDescription("");
        setAmount("");
        setCategory(CATEGORIES[0]);
      } catch (error) {
        console.error("Error al agregar/actualizar la transacción:", error);
      }
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const transactionRef = doc(db, "transactions", id);
      await deleteDoc(transactionRef);
    } catch (error) {
      console.error("Error al eliminar la transacción:", error);
    }
  };

  const cancelEdit = () => {
    setEditingTransaction(null);
    setDescription("");
    setAmount("");
    setCategory(CATEGORIES[0]);
  };

  // ... y en el JSX, justo después de los botones de Ingreso/Gasto:
  {
    editingTransaction && (
      <Button
        onClick={cancelEdit}
        className="mt-2 w-full bg-gray-500 hover:bg-gray-600"
      >
        Cancelar Edición
      </Button>
    );
  }

  const groupedExpenses = transactions.reduce((acc, transaction) => {
    if (transaction.amount < 0) {
      acc[transaction.category] =
        (acc[transaction.category] || 0) + Math.abs(transaction.amount);
    }
    return acc;
  }, {});

  const groupedIncomes = transactions.reduce((acc, transaction) => {
    if (transaction.amount > 0) {
      acc[transaction.category] =
        (acc[transaction.category] || 0) + transaction.amount;
    }
    return acc;
  }, {});

  const pieDataExpenses = Object.entries(groupedExpenses).map(
    ([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length],
    })
  );

  const pieDataIncomes = Object.entries(groupedIncomes).map(
    ([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length],
    })
  );

  if (!user) {
    return <Auth />;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <motion.div
          className="max-w-4xl mx-auto p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">
              Gestión de Finanzas Personales
            </h1>
            <ThemeToggle />
          </div>

          <BalanceCard balance={balance} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="shadow-lg bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                  <CreditCard className="mr-2 h-6 w-6" />
                  {editingTransaction
                    ? "Editar Transacción"
                    : "Nueva Transacción"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label
                    htmlFor="description"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Descripción
                  </Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ej: Comida, Salario, etc."
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  <Label
                    htmlFor="amount"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Monto
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  <Label
                    htmlFor="category"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Categoría
                  </Label>
                  <Select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    options={CATEGORIES}
                    placeholder="Selecciona una categoría"
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => addOrUpdateTransaction("ingreso")}
                      className="flex-1 bg-green-500 hover:bg-green-600"
                    >
                      <Plus className="mr-2 h-4 w-4" />{" "}
                      {editingTransaction ? "Actualizar" : "Ingreso"}
                    </Button>
                    <Button
                      onClick={() => addOrUpdateTransaction("gasto")}
                      className="flex-1 bg-red-500 hover:bg-red-600"
                    >
                      <Minus className="mr-2 h-4 w-4" />{" "}
                      {editingTransaction ? "Actualizar" : "Gasto"}
                    </Button>
                    {editingTransaction && (
                      <Button
                        onClick={cancelEdit}
                        className="flex-1 bg-gray-300 hover:bg-gray-400"
                      >
                        Cancelar Edición
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="shadow-lg bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                  <DollarSign className="mr-2 h-6 w-6" />
                  Últimas Transacciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {currentTransactions.map((transaction) => (
                    <motion.li
                      key={transaction.id}
                      className="flex justify-between items-center p-2 bg-white dark:bg-gray-700 rounded-md shadow-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex-grow mr-2">
                          <span className="text-gray-800 dark:text-white break-words">
                            {transaction.description}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 block">
                            ({transaction.category})
                          </span>
                        </div>
                        <span
                          className={`whitespace-nowrap ${
                            transaction.amount > 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {transaction.amount.toFixed(2)} $
                        </span>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          onClick={() => handleEdit(transaction)}
                          className="bg-blue-500 text-white py-1 px-2 rounded-md shadow-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                        >
                          Editar
                        </Button>
                        <Button
                          onClick={() => deleteTransaction(transaction.id)}
                          variant="destructive"
                          className="bg-red-500 text-white py-1 px-2 rounded-md shadow-md hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                        >
                          Eliminar
                        </Button>
                      </div>
                      </motion.li>
      ))}
    </ul>
    <Pagination
      transactionsPerPage={transactionsPerPage}
      totalTransactions={transactions.length}
      paginate={paginate}
      currentPage={currentPage}
    />
  </CardContent>
</Card>

            <Card className="shadow-lg bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                  Distribución de Gastos
                </CardTitle>
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
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieDataExpenses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                  Distribución de Ingresos
                </CardTitle>
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
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
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
        </motion.div>
      </div>
    </div>
  );
};

export default FinanzasApp;
