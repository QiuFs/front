// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'babel-polyfill'
import 'element-ui/lib/theme-chalk/index.css'
import Layout from './components/layout'
import router from './router'
import store from './store/index.js'
import {
  Pagination,
  Dialog,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  Button,
  ButtonGroup,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Table,
  TableColumn,
  Tabs,
  TabPane,
  Icon,
  Row,
  Col,
  Card,
  Progress,
  Form,
  FormItem,
  // Carousel,
  // CarouselItem,
  Main,
  Loading,
  MessageBox,
  Message,
  Notification
} from 'element-ui';

Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Input);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Checkbox);
Vue.use(CheckboxButton);
Vue.use(CheckboxGroup);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Card);
Vue.use(Progress);
Vue.use(Form);
Vue.use(FormItem);
// Vue.use(Carousel);
// Vue.use(CarouselItem);
Vue.use(Main);

Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;

window.Promise = Promise
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { Layout },
    template: '<Layout/>'
})
