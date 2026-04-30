export const ADMIN_DASHBOARD = '/admin/dashboard';

// Media Routes

export const ADMIN_MEDIA = '/admin/Media';
export const ADMIN_MEDIA_EDIT = (id) => id ? `/admin/Media/edit/${id}` : ''

// Category Routes

export const ADMIN_CATEGORY_ADD = '/admin/category/add';
export const ADMIN_CATEGORY_EDIT = (id) => id ? `/admin/category/edit/${id}` : ''
export const ADMIN_CATEGORY = '/admin/category'

// Trash Route

export const ADMIN_TRASH = '/admin/trash'


// Product Routes

export const ADMIN_PRODUCT = '/admin/product'
export const ADMIN_PRODUCT_ADD = '/admin/product/add'
export const ADMIN_PRODUCT_EDIT = (id) => id ? `/admin/product/edit/${id}` : ''


// Product Varaint Routes

export const ADMIN_PRODUCT_VARIANT = '/admin/product-variant'
export const ADMIN_PRODUCT_VARIANT_ADD = '/admin/product-variant/add'
export const ADMIN_PRODUCT_VARIANT_EDIT = (id) => id ? `/admin/product-variant/edit/${id}` : ''