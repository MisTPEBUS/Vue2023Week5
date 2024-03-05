
export default{
    props:['successAlert','toastMsg'],
    data() {
      return {
       
      };
    },
    mounted() {
    },
    methods: {      
    },
    template:`<transition name="slide"> <div class="alert alert-success" role="alert" id="successAlert"  v-if="successAlert">     
    <span class="mdi mdi-check"></span> {{toastMsg}} 
  </div></transition>`,
}