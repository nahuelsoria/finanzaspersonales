import React, { useState, useEffect, useContext } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  Plus,
  Minus,
  DollarSign,
  CreditCard,
  ShoppingCart,
  Car,
  Home,
  Film,
  Heart,
  GraduationCap,
  ShoppingBag,
  Briefcase,
  MoreHorizontal,
  MoreVertical,
} from "lucide-react";
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
import QuickSummary from "./components/ui/QuickSummary.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/DropdownMenu.jsx";

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

const CATEGORY_ICONS = {
  Alimentación: ShoppingCart,
  Transporte: Car,
  Vivienda: Home,
  Entretenimiento: Film,
  Salud: Heart,
  Educación: GraduationCap,
  Ropa: ShoppingBag,
  Ingresos: Briefcase,
  Otros: MoreHorizontal,
};

const CategoryBadge = ({ category }) => {
  const categoryColors = {
    Alimentación: "bg-red-100 text-red-800",
    Transporte: "bg-blue-100 text-blue-800",
    Vivienda: "bg-green-100 text-green-800",
    Entretenimiento: "bg-purple-100 text-purple-800",
    Salud: "bg-pink-100 text-pink-800",
    Educación: "bg-yellow-100 text-yellow-800",
    Ropa: "bg-indigo-100 text-indigo-800",
    Ingresos: "bg-teal-100 text-teal-800",
    Otros: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        categoryColors[category] || categoryColors["Otros"]
      }`}
    >
      {category}
    </span>
  );
};

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
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const { isDarkMode } = useContext(ThemeContext);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const sortedTransactions = transactions.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  const currentTransactions = sortedTransactions.slice(
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
    setDate(new Date(transaction.date).toISOString().split("T")[0]);
  };

  const addOrUpdateTransaction = async (type) => {
    if (description && amount && category && user && date) {
      const transactionData = {
        description,
        amount: type === "ingreso" ? parseFloat(amount) : -parseFloat(amount),
        category,
        type,
        userId: user.uid,
        date: new Date(date).toISOString(),
        createdAt: new Date(),
      };

      try {
        if (editingTransaction) {
          const transactionRef = doc(db, "transactions", editingTransaction.id);
          await updateDoc(transactionRef, transactionData);
          setEditingTransaction(null);
        } else {
          await addDoc(collection(db, "transactions"), transactionData);
        }
        setDescription("");
        setAmount("");
        setCategory(CATEGORIES[0]);
        setDate(new Date().toISOString().split("T")[0]);
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

  const totalIncome = transactions.reduce(
    (sum, transaction) =>
      transaction.amount > 0 ? sum + transaction.amount : sum,
    0
  );

  const totalExpenses = transactions.reduce(
    (sum, transaction) =>
      transaction.amount < 0 ? sum + Math.abs(transaction.amount) : sum,
    0
  );

  if (!user) {
    return <Auth />;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <motion.div
          className="max-w-7xl mx-auto p-4"
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
          <QuickSummary
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
          />

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
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Descripción
                  </Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ej: Comida, Salario, etc."
                    className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
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
                    htmlFor="date"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Fecha
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
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
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="shadow-lg bg-white dark:bg-gray-800 flex flex-col h-full">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                  <DollarSign className="mr-2 h-6 w-6 text-blue-500" />
                  Últimas Transacciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {currentTransactions.map((transaction) => {
                    const CategoryIcon =
                      CATEGORY_ICONS[transaction.category] || MoreHorizontal;
                    return (
                      <motion.li
                        key={transaction.id}
                        className="flex justify-between items-center p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm mb-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center space-x-3">
                          <CategoryIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                          <span className="text-gray-800 dark:text-white font-medium">
                            {transaction.description}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(transaction.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span
                            className={`${
                              transaction.amount > 0
                                ? "text-green-500"
                                : "text-red-500"
                            } font-bold`}
                          >
                            {transaction.amount.toFixed(2)} $
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button className="p-1 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => handleEdit(transaction)}
                                className="text-blue-500 bg-blue-50 hover:bg-blue-100 dark:text-blue-300 dark:bg-blue-900 dark:hover:bg-blue-800"
                              >
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  deleteTransaction(transaction.id)
                                }
                                className="text-red-500 bg-red-50 hover:bg-red-100 dark:text-red-300 dark:bg-red-900 dark:hover:bg-red-800"
                              >
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </motion.li>
                    );
                  })}
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
