import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import localePtBr from "@fullcalendar/core/locales/pt-br";
import { useDashboardData } from "../data";
import { X, Calendar, Clock, Settings, User, Wrench } from "lucide-react";
import "./Calendar.css";

const CalendarView = () => {
  const { initialEvents, loading } = useDashboardData();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <p>Carregando calendário...</p>;

  return (
    <>
      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale={localePtBr}
          slotMinTime="07:00:00"
          slotMaxTime="18:00:00"
          weekends={true}
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={initialEvents}
          editable={true}
          selectable={true}
          height="auto"
          eventClick={handleEventClick}
        />
      </div>

      {/* Modal de Detalhes do Evento */}
      {isModalOpen && selectedEvent && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Header do Modal */}
            <div className="modal-header">
              <div className="modal-title">
                <h3>Detalhes da {selectedEvent.extendedProps?.tipo === 'manutencao' ? 'Manutenção' : 'Parada'}</h3>
                <span className={`event-badge ${selectedEvent.extendedProps?.tipo}`}>
                  {selectedEvent.extendedProps?.tipo === 'manutencao' ? 'Manutenção' : 'Parada'}
                </span>
              </div>
              <button className="close-button" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            {/* Corpo do Modal */}
            <div className="modal-body">
              {/* Informações Básicas */}
              <div className="info-section">
                <div className="info-item">
                  <Calendar size={16} />
                  <div>
                    <span className="info-label">Data</span>
                    <span className="info-value">
                      {formatDate(selectedEvent.start)}
                    </span>
                  </div>
                </div>

                <div className="info-item">
                  <Clock size={16} />
                  <div>
                    <span className="info-label">Horário</span>
                    <span className="info-value">
                      {formatTime(selectedEvent.start)} - {formatTime(selectedEvent.end)}
                    </span>
                  </div>
                </div>

                {selectedEvent.extendedProps?.maquina && (
                  <div className="info-item">
                    <Settings size={16} />
                    <div>
                      <span className="info-label">Máquina</span>
                      <span className="info-value">
                        #{selectedEvent.extendedProps.maquina}
                      </span>
                    </div>
                  </div>
                )}

                {selectedEvent.extendedProps?.setor && (
                  <div className="info-item">
                    <Wrench size={16} />
                    <div>
                      <span className="info-label">Setor</span>
                      <span className="info-value">
                        {selectedEvent.extendedProps.setor}
                      </span>
                    </div>
                  </div>
                )}

                {selectedEvent.extendedProps?.usuario && (
                  <div className="info-item">
                    <User size={16} />
                    <div>
                      <span className="info-label">Responsável</span>
                      <span className="info-value">
                        ID: {selectedEvent.extendedProps.usuario}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Descrição */}
              <div className="description-section">
                <h4>Descrição</h4>
                <p className="description-text">
                  {selectedEvent.title || "Sem descrição disponível"}
                </p>
              </div>

              {/* Informações Adicionais */}
              {(selectedEvent.extendedProps?.idRegistro || selectedEvent.extendedProps?.idManutencao) && (
                <div className="additional-info">
                  <h4>Informações Técnicas</h4>
                  <div className="info-grid">
                    {selectedEvent.extendedProps?.idRegistro && (
                      <div className="tech-info">
                        <span className="tech-label">ID do Registro:</span>
                        <span className="tech-value">#{selectedEvent.extendedProps.idRegistro}</span>
                      </div>
                    )}
                    {selectedEvent.extendedProps?.idManutencao && (
                      <div className="tech-info">
                        <span className="tech-label">ID da Manutenção:</span>
                        <span className="tech-value">#{selectedEvent.extendedProps.idManutencao}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer do Modal */}
            <div className="modal-footer">
              <button className="close-btn" onClick={closeModal}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CalendarView;