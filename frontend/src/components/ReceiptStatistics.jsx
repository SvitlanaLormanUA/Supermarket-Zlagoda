import React, { useEffect, useState } from 'react';
import SearchAndBack from './SearchAndBack';
import api from '../axios';
import StatisticsModal from './StatisticsModal';

function ReceiptStatistics() {
    const [cashiers, setCashiers] = useState([]);
    const [products, setProducts] = useState([]);
    const [receiptsCashier, setReceiptsCashier] = useState('');
    const [salesCashier, setSalesCashier] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [receiptsStartDate, setReceiptsStartDate] = useState('');
    const [receiptsEndDate, setReceiptsEndDate] = useState('');
    const [cashierStartDate, setCashierStartDate] = useState('');
    const [cashierEndDate, setCashierEndDate] = useState('');
    const [productStartDate, setProductStartDate] = useState('');
    const [productEndDate, setProductEndDate] = useState('');

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

    const getReceiptsByCashier = async () => {
        console.log('[getReceiptsByCashier] receiptsCashier:', receiptsCashier);
        console.log('[getReceiptsByCashier] receiptsStartDate:', receiptsStartDate);
        console.log('[getReceiptsByCashier] receiptsEndDate:', receiptsEndDate);
    
        if (!receiptsStartDate) {
            alert('Please fill all the fields');
            return;
        }
    
        try {
            const params = {};
            let url;
    
            if (!receiptsCashier) {
                url = '/receipts';
                params.date_begin = receiptsStartDate;
                params.date_end = receiptsEndDate;
                console.log('[getReceiptsByCashier] func: get_active_cashiers_with_receipts');
            } else if (!receiptsEndDate) {
                url = `/receipts/${receiptsCashier}`;
                params.date_begin = receiptsStartDate;
                params.id_employee = receiptsCashier;
                console.log('[getReceiptsByCashier] func: get_receipts_by_date');
            } else {
                url = `/receipts/${receiptsCashier}`;
                params.date_begin = receiptsStartDate;
                params.date_end = receiptsEndDate;
                console.log('[getReceiptsByCashier] func: get_cashier_receipt_history');
            }
    
            console.log('[getReceiptsByCashier] GET on url:', url, 'with params:', params);
    
            const response = await api.get(url, { params });
            const parsed = JSON.parse(response.data.body);
    
            console.log('[getReceiptsByCashier] parsed data:', parsed);
    
            if (parsed.status !== 'success' || !parsed.data || parsed.data.length === 0) {
                alert('No data available for selected cashier');
                return;
            }
    
            // Simply use parsed.data as receiptsData
            let receiptsData = parsed.data;
    
            const startDate = new Date(receiptsStartDate);
            const endDate = receiptsEndDate ? new Date(receiptsEndDate) : startDate;
            receiptsData = receiptsData.filter(receipt => {
                const printDate = new Date(receipt.print_date);
                const isInRange = printDate >= startDate && (!receiptsEndDate || printDate <= endDate);
                return isInRange;
            });
    
            if (receiptsData.length === 0) {
                alert('No receipts in given range');
                return;
            }
            console.log(receiptsData);
    
            const modalData = receiptsData.map(receipt => {
                return {
                    check_number: receipt.check_number,
                    employee_name: receipt.employee_name,
                    print_date: receipt.print_date,
                    sum_total: receipt.sum_total,
                    vat: receipt.vat || null,
                    card_number: receipt.card_number,
                    items: Array.isArray(receipt.items) ? receipt.items.map(item => {
                        return {
                            UPC: item.UPC,
                            product_name: item.product_name,
                            category_name: item.category_name,
                            product_number: item.product_number,
                            selling_price: item.selling_price
                        };
                    }) : []
                };
            });
    
            setModalData(modalData);
            setShowModal(true);
    
        } catch (error) {
            console.error('Error fetching data for cashier:', error);
            alert('Failed to fetch data for cashier');
        }
    };

    const getSalesByCashier = async () => {
        if (!cashierStartDate || !cashierEndDate) {
            alert('Please fill all the fields');
            return;
        }

        try {
            const params = {
                start_date: cashierStartDate,
                end_date: cashierEndDate,
            };
            if (salesCashier) {
                params.id_employee = salesCashier;
            }

            const response = await api.get('/sales/cashier', { params });
            const responseBody = JSON.parse(response.data.body);

            if (response.data.status_code !== 200 || !responseBody.data || responseBody.data.length === 0) {
                alert(responseBody.message || 'No data available for selected cashier');
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
        if (!selectedProduct || !productStartDate || !productEndDate) {
            alert('Please fill all the fields');
            return;
        }

        try {
            const response = await api.get('/sales/product', {
                params: {
                    product_id: selectedProduct,
                    start_date: productStartDate,
                    end_date: productEndDate,
                },
            });
            const productData = response.data.body.data;

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

    const getAverageReceiptByProduct = async () => {
        if (!selectedProduct) {
            alert('Please select a product');
            return;
        }

        console.log('selectedProduct', selectedProduct);

        try {
            const response = await api.get('/average-receipt-by-product', {
                params: { product_id: selectedProduct },
            });
            const parsedBody = JSON.parse(response.data.body);
            const productData = parsedBody.data;
    
            if (!productData) {
                console.warn('No data available for selected product:', selectedProduct);
                alert('No data available for the selected product');
                return;
            }
    
            const modalData = {
                id_product: productData.product_id,
                product_name: productData.product_name,
                average_receipt_total: productData.average_receipt_total,
                min_receipt_total: productData.min_receipt_total,
                max_receipt_total: productData.max_receipt_total,
                number_of_receipts: productData.number_of_receipts,
            };
    
            setModalData(modalData);
            setShowModal(true);
            console.log('Modal opened with data');
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
                        <h3>Receipts info by selected cashier</h3>
                        <div className="select-data-section">
                            <select
                                value={receiptsCashier}
                                onChange={(e) => setReceiptsCashier(e.target.value)}
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
                                value={receiptsStartDate}
                                onChange={(e) => setReceiptsStartDate(e.target.value)}
                            />
                            <input
                                type="date"
                                value={receiptsEndDate}
                                onChange={(e) => setReceiptsEndDate(e.target.value)}
                            />
                            <button onClick={getReceiptsByCashier}>→</button>
                        </div>
                    </section>

                    <section className="statistics-box">
                        <h3>Total sales by selected cashier</h3>
                        <div className="select-data-section">
                            <select
                                value={salesCashier}
                                onChange={(e) => setSalesCashier(e.target.value)}
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
                                value={cashierStartDate}
                                onChange={(e) => setCashierStartDate(e.target.value)}
                            />
                            <input
                                type="date"
                                value={cashierEndDate}
                                onChange={(e) => setCashierEndDate(e.target.value)}
                            />
                            <button onClick={getSalesByCashier}>→</button>
                        </div>
                    </section>

                    {/* complicated */}
                    <section className="statistics-box" style={{ width: '400px' }}>
                        <h3>Average sum of receipt by product</h3>
                        <div className="select-data-section">
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
                            <button onClick={getAverageReceiptByProduct}>→</button>
                        </div>
                    </section>

                    <section className="statistics-box" style={{ width: '400px' }}>
                        <h3>Total quantity of sold product</h3>
                        <div className="select-data-section">
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
                                value={productStartDate}
                                onChange={(e) => setProductStartDate(e.target.value)}
                            />
                            <input
                                type="date"
                                value={productEndDate}
                                onChange={(e) => setProductEndDate(e.target.value)}
                            />
                            <button onClick={getQuantityOfProduct}>→</button>
                        </div>
                    </section>
                </div>
            </div>
            {showModal && <StatisticsModal data={modalData} onClose={() => setShowModal(false)} />}
        </div>
    );
}

export default ReceiptStatistics;
