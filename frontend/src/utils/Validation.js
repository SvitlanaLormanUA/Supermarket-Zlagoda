export const validateUniqueField = (newItem, existingItems, uniqueField) => {
    const exists = existingItems.some(item => item[uniqueField] === newItem[uniqueField]);

    if (exists) {
        alert(`${uniqueField} must be unique.`);
        return false;
    }
    return true;
};

export const validateProduct = (newProduct) => {
    const requiredFields = ['category_number', 'product_name', 'characteristics'];

    for (let field of requiredFields) {
        const value = newProduct[field];
        if (value === undefined || value === null || value.toString().trim() === '') {
            alert(`${field} cannot be empty.`);
            return false;
        }
    }
    return true;
};

export const validateProductInStore = (rawProduct) => {
    const newProduct = { ...rawProduct };

    if ('UPC_prom' in newProduct && newProduct.UPC_prom === '') {
        newProduct.UPC_prom = null;
    }
    if ('promotional_product' in newProduct) {
        if (newProduct.promotional_product === 'true') {
            newProduct.promotional_product = true;
        } else if (newProduct.promotional_product === 'false') {
            newProduct.promotional_product = false;
        }
    }

    const requiredFields = ['UPC', 'id_product', 'selling_price', 'products_number', 'promotional_product'];

    for (let field of requiredFields) {
        const value = newProduct[field];

        if (value === undefined || value === null) {
            alert(`${field} cannot be empty.`);
            return null;
        }
        if (field === 'promotional_product') {
            if (typeof value !== 'boolean') {
                alert('Promotional Product must be true or false.');
                return null;
            }
        }
    }
    if (newProduct.promotional_product === false && newProduct.UPC_prom) {
        alert('If UPC_prom exists, promotional_product must be true.');
        return null;
    }
    if (newProduct.promotional_product === true && !newProduct.UPC_prom) {
        alert('If Promotional Product is true, UPC_prom must be filled.');
        return null;
    }

    return newProduct;
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

export const validateEmployee = (newEmployee) => {
    const requiredFields = [
        'id_employee',
        'empl_surname',
        'empl_name',
        'empl_role',
        'salary',
        'date_of_birth',
        'date_of_start',
        'phone_number',
        'city',
        'street',
        'zip_code',
    ];
    for (let field of requiredFields) {
        const value = newEmployee[field];
        if (value === undefined || value === null || value.toString().trim() === '') {
            alert(`${field} cannot be empty.`);
            return false;
        }
    }
    const salary = parseFloat(newEmployee.salary);
    if (isNaN(salary) || salary < 0) {
        alert('Salary must be a non-negative number.');
        return false;
    }
    const birthDate = new Date(newEmployee.date_of_birth);
    const startDate = new Date(newEmployee.date_of_start);

    if (isNaN(birthDate) || isNaN(startDate)) {
        alert('Invalid date format for Date of Birth or Date of Start.');
        return false;
    }

    if (birthDate >= startDate) {
        alert('Date of Birth must be earlier than Date of Start.');
        return false;
    }
    const ageAtStart = startDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = startDate.getMonth() - birthDate.getMonth();
    const dayDifference = startDate.getDate() - birthDate.getDate();
    let realAge = ageAtStart;

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        realAge--;
    }
    if (realAge < 18) {
        alert('Employee must be at least 18 years old at the start date.');
        return false;
    }
    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phoneRegex.test(newEmployee.phone_number)) {
        alert('Phone number must be 10-15 digits, optionally starting with +.');
        return false;
    }

    return true;
};

export function validateReceiptStep1(form) {
    const required = ['check_number', 'id_employee', 'print_date'];
    for (let f of required) {
        if (!form[f]) {
            alert(`${f} is required`);
            return false;
        }
    }
    return true;
}

export function validateReceiptBeforeSave(products) {
    if (products.length === 0) {
        alert('Add at least one product');
        return false;
    }
    return true;
}

