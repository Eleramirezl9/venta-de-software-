import React from 'react';

const CisnetIcon = ({ className = "h-8 w-8", simple = false, ...props }) => {
  if (simple) {
    // Versión simplificada para header/footer
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        {/* Cuerpo del cisne simplificado */}
        <ellipse cx="12" cy="16" rx="7" ry="4" fill="currentColor" opacity="0.9" />
        
        {/* Cuello del cisne */}
        <path
          d="M8 14 Q6 10 8 7 Q10 5 12 6 Q13 7 12.5 9 Q12 11 10 12 Q9 13 8 14"
          fill="currentColor"
          opacity="0.9"
        />
        
        {/* Cabeza */}
        <circle cx="12" cy="6.5" r="2.5" fill="currentColor" opacity="0.9" />
        
        {/* Pico */}
        <path d="M14.5 6.5 Q16.5 6 17 7 Q16.5 8 14.5 7.5" fill="#FF8C42" />
        
        {/* Ojo */}
        <circle cx="12.5" cy="6" r="0.5" fill="white" />
        
        {/* Ala */}
        <path d="M12 14 Q18 12 19 16 Q17 18 15 17 Q13 16 12 15" fill="currentColor" opacity="0.6" />
      </svg>
    );
  }

  // Versión completa para favicon y logos grandes
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Marco circular */}
      <circle cx="50" cy="50" r="45" fill="white" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      
      {/* Cuerpo del cisne */}
      <ellipse cx="45" cy="65" rx="25" ry="15" fill="currentColor" opacity="0.8" />
      
      {/* Cuello del cisne */}
      <path
        d="M35 55 Q25 45 30 35 Q35 25 45 30 Q50 32 48 38 Q46 42 42 45 Q38 50 35 55"
        fill="currentColor"
        opacity="0.8"
      />
      
      {/* Cabeza del cisne */}
      <ellipse cx="45" cy="32" rx="6" ry="8" fill="currentColor" opacity="0.8" />
      
      {/* Pico naranja */}
      <path d="M52 32 Q58 30 60 33 Q58 36 52 34" fill="#FF8C42" />
      
      {/* Ojo */}
      <circle cx="47" cy="30" r="2" fill="black" />
      <circle cx="48" cy="29" r="0.8" fill="white" />
      
      {/* Alas con colores dinámicos */}
      <path
        d="M45 60 Q65 55 70 65 Q68 75 60 75 Q50 72 45 65"
        fill="currentColor"
        opacity="0.6"
      />
      <path
        d="M47 62 Q62 58 66 66 Q64 72 58 72 Q52 70 47 65"
        fill="currentColor"
        opacity="0.4"
      />
    </svg>
  );
};

export default CisnetIcon;