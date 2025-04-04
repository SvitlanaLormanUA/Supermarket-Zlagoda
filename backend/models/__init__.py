from .get import (
    get_all_store_products,
    get_all_categories,
    get_products_by_category,
    get_product_info,
    get_total_price,
    get_total_quantity,
    get_all_customer_cards
)

from .add import (
    add_new_product,
    add_new_category
)

from .delete import (
    delete_product
    delete_category
)

from .update import (
    update_product
)

__all__ = [
    'get_all_store_products',
    'get_all_categories',
    'get_products_by_category',
    'get_product_info',
    'get_total_price',
    'get_total_quantity',
    'get_all_customer_cards'
    'add_new_product',
    'add_new_category',
    'delete_product',
    'delete_category',
    'update_product'
]