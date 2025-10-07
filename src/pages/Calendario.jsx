import React from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from "@fullcalendar/daygrid";
import localePtBr from '@fullcalendar/core/locales/pt-br';
import initialEvents from '../data';

const CalendarView = () => {
  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[timeGridPlugin]}
        
        initialView="timeGridWeek" 
        locale={localePtBr}
        slotMinTime="07:00:00" 
        slotMaxTime="18:00:00" 
        weekends={true}
        
        headerToolbar={{
          left: 'prev,next',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        
        events={initialEvents} 
        
        editable={true}
        selectable={true} 
        
        initialDate="2025-09-24"
        height="auto"
      />
    </div>
  );
};

export default CalendarView;