import React, { useEffect, useState } from 'react';
import SearchAndBack from './SearchAndBack';
import api from '../axios';
import StatisticsModal from './StatisticsModal';

function ReceiptStatistics() {
    const [cashiers, setCashiers] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCashier, setSelectedCashier] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [modalData, setModalData] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        api.get('/employees/cashiers')
            .then((res) => {
                const parsed = JSON.parse(res.data.body);
                setCashiers(parsed.data);
            })
            .catch((err) => console.error('Error loading cashiers:', err));

        api.get('/products-in-store')
            .then((res) => {
                const parsed = JSON.parse(res.data.body);
                setProducts(parsed.data);
            })
            .catch((err) => console.error('Error loading products:', err));
    }, []);

    const getSalesByCashier = async () => {
        if (!startDate || !endDate) {
            alert('Please fill all the fields');
            return;
        }

        try {
            const params = {
                start_date: startDate,
                end_date: endDate,
            };
            if (selectedCashier) {
                params.id_employee = selectedCashier;
            }
            
            const response = await api.get('/sales/cashier', { params });
            const responseBody = JSON.parse(response.data.body); 

            if (response.data.status_code !== 200 || !responseBody.data || responseBody.data.length === 0) {
                alert(responseBody.message || 'No data avaliable for selected cashier');
                return;
            }

            const cashierData = responseBody.data;

            const modalData = Array.isArray(cashierData)
                ? cashierData.map(data => ({
                    id_employee: data.id_employee,
                    empl_surname: data.empl_surname,
                    empl_name: data.empl_name,
                    total_sales: data.total_sales,
                }))
                : [{
                    id_employee: cashierData.id_employee,
                    empl_surname: cashierData.empl_surname,
                    empl_name: cashierData.empl_name,
                    total_sales: cashierData.total_sales,
                }];

            setModalData(modalData);
            setShowModal(true);

        } catch (error) {
            console.error('Error fetching data for cashier:', error);
            alert('Failed to fetch data for cashier');
        }
    };

    const getQuantityOfProduct = async () => {
        if (!selectedProduct || !startDate || !endDate) {
            alert('Please fill all the fields');
            return;
        }

        try {
            const response = await api.get('/sales/product', {
                params: {
                    product_id: selectedProduct,
                    start_date: startDate,
                    end_date: endDate,
                },
            });

            const responseBody = response.data.body;
            const productData = responseBody.data;

            if (!productData) {
                alert('No data available for the selected product');
                return;
            }

            const modalData = {
                id_product: productData.id_product,
                product_name: productData.product_name,
                total_quantity_sold: productData.total_quantity_sold
            };

            setModalData(modalData);
            setShowModal(true);

        } catch (error) {
            console.error('Error fetching data for selected product:', error);
            alert('Failed to fetch data for product');
        }
    };

    return (
        <div className="statistics-container">
            <div className="searchAndBackSection">
                <SearchAndBack />
            </div>

            <div className="statistics-section">
                <div className="statistics-grid">
                    <section className="statistics-box">
                        <select>
                            <option value="">Select Cashier</option>
                            {cashiers.map((cashier) => (
                                <option key={cashier.id_employee} value={cashier.id_employee}>
                                    {cashier.empl_surname}
                                </option>
                            ))}
                        </select>
                        <input type="date" />
                        <button>→</button>
                    </section>

                    <section className="statistics-box">
                        <select
                            value={selectedCashier}
                            onChange={(e) => setSelectedCashier(e.target.value)}
                        >
                            <option value="">Select Cashier</option>
                            {cashiers.map((cashier) => (
                                <option key={cashier.id_employee} value={cashier.id_employee}>
                                    {cashier.id_employee} - {cashier.empl_surname}
                                </option>
                            ))}
                        </select>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                        <button onClick={getSalesByCashier}>→</button>
                    </section>
                </div>

                <section className="statistics-box" style={{ width: '400px' }}>
                    <select
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                        <option value="">Select Product</option>
                        {products.map((product) => (
                            <option key={product.id_product} value={product.id_product}>
                                {product.product_name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    <button onClick={getQuantityOfProduct}>→</button>
                </section>
            </div>
            {showModal && <StatisticsModal data={modalData} onClose={() => setShowModal(false)} />}
        </div>
    );
}

export default ReceiptStatistics;