import { useState, useEffect } from 'react'
import './App.css'

function App() {
    const [transactions, setTransactions] = useState([])
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState('')
    const [type, setType] = useState('income')

    const balance = transactions.reduce((acc, t) => {
        return t.type === 'income' ? acc + t.amount : acc - t.amount
    }, 0)

    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0)

    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0)

    useEffect(() => {
        fetchTransactions()
    }, [])

    const fetchTransactions = async () => {
        const res = await fetch('http://localhost:8000/transactions')
        const data = await res.json()
        setTransactions(data)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!description || !amount) return

        await fetch('http://localhost:8000/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                description,
                amount: parseFloat(amount),
                type
            })
        })
        setDescription('')
        setAmount('')
        fetchTransactions()
    }

    const handleDelete = async (id) => {
        await fetch(`http://localhost:8000/transactions/${id}`, {
            method: 'DELETE'
        })
        fetchTransactions()
    }

    return (
        <div className="container">
            <header className="header">
                <h1>Budget Dashboard</h1>
            </header>

            <div className="balance-cards">
                <div className="card balance">
                    <h3>Balance</h3>
                    <p className={balance >= 0 ? 'positive' : 'negative'}>
                        {balance.toFixed(2)} zł
                    </p>
                </div>
                <div className="card income">
                    <h3>Income</h3>
                    <p className="positive">+{income.toFixed(2)} zł</p>
                </div>
                <div className="card expenses">
                    <h3>Expenses</h3>
                    <p className="negative">-{expenses.toFixed(2)} zł</p>
                </div>
            </div>

            <div className="add-transaction">
                <h2>Add Transaction</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                    <button type="submit">Add</button>
                </form>
            </div>

            <div className="transaction-history">
                <h2>Transaction History</h2>
                {transactions.length === 0 ? (
                    <p className="empty-state">No transactions yet</p>
                ) : (
                    <ul>
                        {transactions.map((t) => (
                            <li key={t.id} className={t.type}>
                                <span>{t.description}</span>
                                <span className={t.type === 'income' ? 'positive' : 'negative'}>
                                    {t.type === 'income' ? '+' : '-'}{t.amount.toFixed(2)} zł
                                </span>
                                <button onClick={() => handleDelete(t.id)}>×</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default App
