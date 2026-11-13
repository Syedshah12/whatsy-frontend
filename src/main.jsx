import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
     <Toaster position="bottom-right" richColors visibleToasts={3} />
  </Provider>
)
