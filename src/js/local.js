
// const SET_ITEM = (key, value) => {
//     try {
//       const serializedState = JSON.stringify(value);
//       localStorage.setItem(key, serializedState);
//     } catch (error) {
//       console.error("Set state error: ", error.message);
//     }
//   };
  
//   const GET_ITEM = key => {
//     try {
//       const serializedState = localStorage.getItem(key);
//       return serializedState === null ? undefined : JSON.parse(serializedState);
//     } catch (error) {
//       console.error("Get state error: ", error.message);
//     }
//   };
//   const REMOVE_ITEM = key => {
//     try {
//       localStorage.removeItem(key);
      
//     } catch (error) {
//       console.error("Get state error: ", error.message);
//     }
//   };
  
//   export default {
//     SET_ITEM,
//     GET_ITEM,
//     REMOVE_ITEM,
//   };