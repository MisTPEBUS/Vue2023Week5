import userProductModal from './userProductModal.js';
import alertModal from "./alertModal.js";
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({
  generateMessage: localize('zh_TW'),
});

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'lobinda';

Vue.createApp({
  data() {
    return {
      toastMsg:'',
      successAlert:false,
      loadingStatus: {
        loadingItem: '',
      },
      products: [],
      product: {},
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
          message:'',
        },
        message: '',
      },
      cart: {},
    };
  },
  components: {
    alertModal,
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  methods: {
    alertShow(){
      this.successAlert=true;
            setTimeout(() => 
            {
              this.successAlert=false;
            }
            , 3000); 
    },
    getProducts(page,category) {
      console.log(apiUrl);
      console.log(apiPath);
    /*   */
     const url = `https://vue3-course-api.hexschool.io/v2/api/lobinda/products/all`;
      axios.get(url,{params:{page:page,category:category, }}).then((response) => {
        this.products = response.data.products;
      }).catch((err) => {
        alert(err.response.data.message);
      }); 
    },
    getProduct(id) {
      const url = `${apiUrl}/api/${apiPath}/product/${id}`;
      
      this.loadingStatus.loadingItem = id;
      axios.get(url).then((response) => {
        console.log(response);
       // const {} = response.data;
        this.loadingStatus.loadingItem = '';
        this.product = response.data.product;
        this.$refs.userProductModal.openModal();
      }).catch((err) => {
        alert(err.response.data.message);
      });
    },
    addToCart(id, qty = 1) {
      const url = `${apiUrl}/api/${apiPath}/cart`;
      this.loadingStatus.loadingItem = id;
      const cart = {
        product_id: id,
        qty,
      };

      this.$refs.userProductModal.hideModal();
      axios.post(url, { data: cart }).then((response) => {
        this.toastMsg = response.data.message;
        this.alertShow();
     
        this.loadingStatus.loadingItem = '';
        this.getCart();
      }).catch((err) => {
        alert(err.response.data.message);
      });
    },
    updateCart(data) {
      this.loadingStatus.loadingItem = data.id;
      const url = `${apiUrl}/api/${apiPath}/cart/${data.id}`;
      const cart = {
        product_id: data.product_id,
        qty: data.qty,
      };
      axios.put(url, { data: cart }).then((response) => {
        this.toastMsg = response.data.message;
        this.alertShow();
        this.loadingStatus.loadingItem = '';
        this.getCart();
      }).catch((err) => {
        alert(err.response.data.message);
        this.loadingStatus.loadingItem = '';
      });
    },
    deleteAllCarts() {
      const url = `${apiUrl}/api/${apiPath}/carts`;
      axios.delete(url).then((response) => {
        this.toastMsg = response.data.message;
        this.alertShow();
        this.getCart();
      }).catch((err) => {
        alert(err.response.data.message);
      });
    },
    getCart() {
      const url = `${apiUrl}/api/${apiPath}/cart`;
      axios.get(url).then((response) => {
        this.cart = response.data.data;
      }).catch((err) => {
        alert(err.response.data.message);
      });
    },
    removeCartItem(id) {
      const url = `${apiUrl}/api/${apiPath}/cart/${id}`;
      this.loadingStatus.loadingItem = id;
      axios.delete(url).then((response) => {
        this.toastMsg = response.data.message;
        this.alertShow();
        this.loadingStatus.loadingItem = '';
        this.getCart();
      }).catch((err) => {
        alert(err.response.data.message);
      });
    },
    createOrder() {
      const url = `${apiUrl}/api/${apiPath}/order`;
      const order = this.form;
      axios.post(url, { data: order }).then((response) => {
        this.toastMsg = response.data.message;
        this.alertShow();
      
        this.$refs.form.resetForm();
         
        this.getCart();
      }).catch((err) => {
        alert(err.response.data.message);
      });
    },
  },
  mounted() {
    this.getProducts(1,'sdf');
    this.getCart();
  },
})
  .component('userProductModal', userProductModal)
  .mount('#app');