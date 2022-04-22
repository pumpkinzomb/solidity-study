import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import StudyChapter1 from './study_chapter/chapter1';
import StudyChapter2 from './study_chapter/chapter2';
import StudyChapter3 from './study_chapter/chapter3';
import StudyChapter4 from './study_chapter/chapter4';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/chapter1" element={<StudyChapter1 />} />
                <Route path="/chapter2" element={<StudyChapter2 />} />
                <Route path="/chapter3" element={<StudyChapter3 />} />
                <Route path="/chapter4" element={<StudyChapter4 />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
