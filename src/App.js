import React, { useState, useEffect, useContext } from "react";
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
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button.jsx";
import { Input } from "./components/ui/input.jsx";
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
import QuickFilters from "./components/ui/QuickFilters.jsx";
import { formatNumber } from "./lib/utils.js";
import IncomeExpenseChart from './components/ui/IncomeExpenseChart.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/Tabs.jsx";
import CategoriasPieChart from './components/ui/CategoriasPieChart.jsx';

// Definición de categorías para las transacciones
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

// Mapeo de categorías a iconos
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

// Componente principal de la aplicación de finanzas
const FinanzasApp = () => {
  // Estados para manejar las transacciones y la interfaz de usuario
  const [transactions, setTransactions] = useState([]); // Lista de transacciones
  const [description, setDescription] = useState(""); // Descripción de la transacción
  const [amount, setAmount] = useState(""); // Monto de la transacción
  const [balance, setBalance] = useState(0); // Balance total
  const [user, setUser] = useState(null); // Usuario actual
  const [editingTransaction, setEditingTransaction] = useState(null); // Transacción en edición
  const [category, setCategory] = useState(CATEGORIES[0]); // Categoría seleccionada
  const [currentPage, setCurrentPage] = useState(1); // Página actual para paginación
  const [transactionsPerPage] = useState(10); // Número de transacciones por página
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Fecha de la transacción
  const [currentFilter, setCurrentFilter] = useState("all"); // Filtro actual

  // Obtener el modo de tema (claro/oscuro) del contexto
  const { isDarkMode } = useContext(ThemeContext);

  // Función para cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Cálculo de índices para la paginación
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  
  // Ordenar transacciones por fecha (más recientes primero)
  const sortedTransactions = transactions.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Función para filtrar transacciones según el filtro actual
  const filterTransactions = (transactions) => {
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    switch (currentFilter) {
      case "income":
        return transactions.filter((t) => t.amount > 0);
      case "expense":
        return transactions.filter((t) => t.amount < 0);
      case "thisMonth":
        return transactions.filter((t) => new Date(t.date) >= thisMonth);
      case "lastMonth":
        return transactions.filter(
          (t) => new Date(t.date) >= lastMonth && new Date(t.date) < thisMonth
        );
      default:
        return transactions;
    }
  };

  // Aplicar filtros y paginación a las transacciones
  const filteredTransactions = filterTransactions(sortedTransactions);
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  // Función para generar contenido CSV de las transacciones
  const generateCSV = (transactions) => {
    const headers = ["Fecha", "Descripción", "Categoría", "Monto", "Tipo"];
    const csvContent = [
      headers.join(","),
      ...transactions.map((t) =>
        [
          new Date(t.date).toLocaleDateString(),
          t.description.replace(/,/g, ";"),
          t.category,
          t.amount.toFixed(2),
          t.amount > 0 ? "Ingreso" : "Gasto",
        ].join(",")
      ),
    ].join("\n");

    return csvContent;
  };

  // Función para descargar las transacciones como archivo CSV
  const downloadCSV = (transactions) => {
    const csvContent = generateCSV(transactions);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "transacciones_finanzas_personales.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Efecto para manejar la autenticación y cargar las transacciones del usuario
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
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

  // Efecto para calcular el balance total cuando cambian las transacciones
  useEffect(() => {
    const newBalance = transactions.reduce((acc, transaction) => {
      const amount = parseFloat(transaction.amount);
      return isNaN(amount) ? acc : acc + amount;
    }, 0);
    setBalance(newBalance);
  }, [transactions]);

  // Función para manejar la edición de una transacción
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setDescription(transaction.description);
    setAmount(Math.abs(transaction.amount).toString());
    setCategory(transaction.category);
    setDate(new Date(transaction.date).toISOString().split("T")[0]);
  };

  // Función para agregar o actualizar una transacción
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

  // Función para eliminar una transacción
  const deleteTransaction = async (id) => {
    try {
      const transactionRef = doc(db, "transactions", id);
      await deleteDoc(transactionRef);
    } catch (error) {
      console.error("Error al eliminar la transacción:", error);
    }
  };

  // Función para cancelar la edición de una transacción
  const cancelEdit = () => {
    setEditingTransaction(null);
    setDescription("");
    setAmount("");
    setCategory(CATEGORIES[0]);
  };

  // Cálculo del total de ingresos
  const totalIncome = transactions.reduce(
  (sum, transaction) => transaction.amount > 0 ? sum + transaction.amount : sum,
  0
);

  // Cálculo del total de gastos
  const totalExpenses = transactions.reduce(
  (sum, transaction) => transaction.amount < 0 ? sum + Math.abs(transaction.amount) : sum,
  0
);

  // Si no hay usuario autenticado, mostrar componente de autenticación
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
            totalIncome={formatNumber(totalIncome)}
            totalExpenses={formatNumber(totalExpenses)}
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
                <form className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Descripción"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="flex-grow"
                    />
                    <Input
                      type="number"
                      placeholder="Monto"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-1/3"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      options={CATEGORIES}
                      placeholder="Categoría"
                      className="flex-grow"
                    />
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-1/3"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      onClick={() => addOrUpdateTransaction("ingreso")}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                      <Plus className="mr-2 h-4 w-4" />{" "}
                      {editingTransaction ? "Actualizar" : "Ingreso"}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => addOrUpdateTransaction("gasto")}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                      <Minus className="mr-2 h-4 w-4" />{" "}
                      {editingTransaction ? "Actualizar" : "Gasto"}
                    </Button>
                  </div>
                </form>
                {editingTransaction && (
                  <Button
                    onClick={cancelEdit}
                    className="mt-2 w-full bg-gray-500 hover:bg-gray-600"
                  >
                    Cancelar Edición
                  </Button>
                )}
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
                <Button
                  onClick={() => downloadCSV(transactions)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar a CSV
                </Button>
              </CardHeader>
              <CardContent>
                <QuickFilters setFilter={setCurrentFilter} />
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
                            {formatNumber(transaction.amount)} $
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
                  totalTransactions={filteredTransactions.length}
                  paginate={paginate}
                  currentPage={currentPage}
                />
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-white dark:bg-gray-800 mb-6">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                  Gráficos Financieros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="barras" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="barras">Ingresos y Gastos</TabsTrigger>
                    <TabsTrigger value="torta">Categorías</TabsTrigger>
                  </TabsList>
                  <TabsContent value="barras">
                    <IncomeExpenseChart transactions={transactions} />
                  </TabsContent>
                  <TabsContent value="torta">
                    <CategoriasPieChart transactions={transactions} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FinanzasApp;