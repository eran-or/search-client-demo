import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./routes/home";
import {loader as formLoader} from "./features/search/SearchForm";
import SearchResults , {  loader as searchResultsLoader } from "./features/search/SearchResults";

const container = document.getElementById("root")!;
const root = createRoot(container);

/*
routes 
 / - will show the search input and and outlet
 the children routes of / are: 
    / - will render no results route before search or if the no results returned from the search
    /search - will display the search results after search 
*/

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    loader: formLoader,
    children: [
      {
        path: "search",
        element: <SearchResults />,
        loader: searchResultsLoader,
      }
    ],
  },
],{
  basename: process.env.PUBLIC_URL
});

console.log(process.env.PUBLIC_URL);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
