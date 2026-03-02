import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Login } from './components/Login';
import { EventsList } from './components/EventsList';
import { EventDetails } from './components/EventDetails';
import { CreateEvent } from './components/CreateEvent';
import { MyEvents } from './components/MyEvents';
import './styles/index.css';

export function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/auth" element={<Login />} />
        <Route path="/events" element={<EventsList />} />
        <Route path="/events/new" element={<CreateEvent />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="*" element={<EventsList />} />
      </Routes>
    </BrowserRouter>
  );
}
