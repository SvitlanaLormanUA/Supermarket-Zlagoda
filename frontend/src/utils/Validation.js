export const validateUniqueProductInStore = (newProduct, productsInStore) => {
    const existingUPC = productsInStore.some(product => product.UPC === newProduct.UPC);
    const existingProductId = productsInStore.some(product => product.id_product === newProduct.id_product);

    if (existingUPC) {
        alert("UPC must be unique.");
        return false;
    }
    if (existingProductId) {
        alert("ProductId must be unique.");
        return false;
    }
    return true;
}

export const validateProductInStore = (newProduct) => {
    const requiredFields = ['UPC', 'id_product', 'selling_price', 'products_number'];
    for (let field of requiredFields) {
        if (field !== 'UPC_prom' && !newProduct[field]) {
            alert(`${field} cannot be empty.`);
            return false;
        }
    }
    if (newProduct['UPC_prom'] && (newProduct['promotional_product'] === false || newProduct['promotional_product'] === undefined)) {
        alert("If UPC_prom is filled, Promotional Product must be true.");
        return false;
    }
    if (newProduct['promotional_product'] === true && !newProduct['UPC_prom']) {
        alert("If Promotional Product is true, UPC_prom must be filled.");
        return false;
    }
    return true;
};

export const validateCategories = (newCategory) => {
    const requiredFields = ['category_name'];
    for (let field of requiredFields) {
        if (!newCategory[field]) {
            alert(`${field} cannot be empty.`);
            return false;
        }
    }
    return true;
};

export const validateCustomerCard = (customer) => {
    const requiredFields = [
        'card_number',
        'cust_surname',
        'cust_name',
        'cust_patronymic',
        'city',
        'street',
        'zip_code',
        'percent'
    ];

    for (let field of requiredFields) {
        const value = customer[field];
        if (value === undefined || value === null || value.toString().trim() === '') {
            alert(`${field} cannot be empty.`);
            return false;
        }
    }

    const percent = parseFloat(customer.percent);
    if (isNaN(percent) || percent < 0 || percent > 100) {
        alert("Percent must be a number between 0 and 100.");
        return false;
    }
    return true;
};
