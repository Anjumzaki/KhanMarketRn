import { combineReducers } from 'redux';
import user from './user';
import Cart from './Cart';
import Store from './Store';
import CartSize from './CartSize';
import SingleCatName from './SingleCatName';
import Location from './Location';
import Filter from './Filter';
import Search from './Search';
import Search1 from './Search1';
import favStore from './favStore';



export default combineReducers({
    user,
    Cart,
    Store,
    CartSize,
    SingleCatName,
    Location,
    Filter,
    Search,
    Search1,
    favStore
})
