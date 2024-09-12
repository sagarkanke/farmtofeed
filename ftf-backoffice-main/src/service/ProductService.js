import apiClient from './apiClient';
export class ProductService {
    getProductsSmall() {
        return fetch('/demo/data/products-small.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }

    getProducts() {
        return fetch('/demo/data/products.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }

    getProductsMixed() {
        return fetch('/demo/data/products-mixed.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }

    getProductsWithOrdersSmall() {
        return fetch('/demo/data/products-orders-small.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }

    getProductsWithOrdersLarge() {
        return fetch('/demo/data/products-orders.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }

    getLineItems() {
        return fetch('/demo/data/line-items.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }

    fetchAllProducts(){
        return apiClient.get('/products')
        .then(response => response.data);
      }

      deleteProduct(id){
        return apiClient.delete(`/products/${id}`)
        .then(response => response.data);
      }

      createNewProduct(data){
        return apiClient.post(`/products`,data)
        .then(response => response.data);
      }

    //   Product Variants
    createProductVariant(formData){
        return apiClient.post('/products/unit-variations', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Override header for multipart request
            },
        })
        .then(response => response.data);
      }

}
