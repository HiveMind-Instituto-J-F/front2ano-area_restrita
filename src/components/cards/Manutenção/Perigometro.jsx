import ReactSpeedometer from "react-d3-speedometer"

// Defina as cores para facilitar a manutenção e uso na legenda
const DANGER_COLOR = '#FF5F6D'; // Vermelho
const CAUTION_COLOR = '#FFC371'; // Laranja
const GOOD_COLOR = '#007bff';    // Azul
const EXCELLENT_COLOR = '#28a745'; // Verde

// Componente auxiliar para renderizar cada item da legenda
const LegendItem = ({ color, label }) => (
    <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        fontSize: '0.85em' 
    }}>
      <span style={{ 
        display: 'inline-block', 
        width: '10px', 
        height: '10px', 
        backgroundColor: color, 
        marginRight: '5px',
        borderRadius: '50%'
      }}></span>
      <span>{label}</span>
    </div>
);

const GaugeManutencaoD3 = ({ valorAtual }) => {
  return (
    // Card compacto: 300px de largura
    <div className="card" style={{ width: "100%", maxWidth: "440px", padding: "30px", marginLeft: "40px", boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        
      <h3 style={{ textAlign: 'center', marginBottom: '15px', fontSize: '1.1em' }}>
        Manutenções vs. Paradas
      </h3>

      {/* Contêiner do medidor */}
      <div style={{ width: '100%', height: '180px', marginLeft: '75px' }}>
        <ReactSpeedometer
          width={280} 
          height={180} 

          maxValue={100} 
          minValue={0}   
          value={valorAtual} 

          customSegmentStops={[0, 30, 50, 75, 100]} 
          segmentColors={[
            DANGER_COLOR, // 0 a 30
            CAUTION_COLOR, // 30 a 50
            GOOD_COLOR,    // 50 a 75
            EXCELLENT_COLOR, // 75 a 100
          ]}
          
          ringWidth={35} 
          needleColor="navy" 
          currentValueText={`${valorAtual}`}
          valueTextFontSize="20px"
          labelFontSize="10px" 
        />
      </div>

      {/* --- Legenda (Adicionada) --- */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', // Centraliza o bloco de legendas
        gap: '10px', // Espaçamento horizontal entre os itens
        marginTop: '15px', 
        flexWrap: 'wrap' // Permite que a legenda quebre a linha se a tela for pequena
      }}>
        <LegendItem color={DANGER_COLOR} label="0-30: Perigo" />
        <LegendItem color={CAUTION_COLOR} label="30-50: Cuidado" />
        <LegendItem color={GOOD_COLOR} label="50-75: Bom" />
        <LegendItem color={EXCELLENT_COLOR} label="75-100: Ótimo" />
      </div>
      {/* ------------------------- */}
    </div>
  );
};

export default () => <GaugeManutencaoD3 valorAtual={45} />;