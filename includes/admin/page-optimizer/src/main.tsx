import React from "react";
import "./index.css";
import App from "app/app";

import { createRoot } from 'react-dom/client';
const container = document.getElementById('rapidload-page-optimizer') as HTMLDivElement;
const root = createRoot(container); // createRoot(container!) if you use TypeScript

root.render(<App />);

