import { useEffect, useState } from "react";

const Confetti = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Crear partículas de confeti
    const colors = [
      "#f43f5e",
      "#ec4899",
      "#8b5cf6",
      "#3b82f6",
      "#10b981",
      "#f59e0b",
    ];
    const newParticles = [];

    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -20 - Math.random() * 80,
        size: 3 + Math.random() * 7,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        speed: 2 + Math.random() * 4,
        rotationSpeed: -1 + Math.random() * 2,
        horizontalSpeed: -2 + Math.random() * 4,
      });
    }

    setParticles(newParticles);

    // Animar las particulas
    const interval = setInterval(() => {
      setParticles(
        (prevParticles) =>
          prevParticles
            .map((particle) => ({
              ...particle,
              y: particle.y + particle.speed,
              x: particle.x + particle.horizontalSpeed,
              rotation: particle.rotation + particle.rotationSpeed,
            }))
            .filter((particle) => particle.y < 120) // Elimina las particulas que salen de la pantalla
      );
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size * 1.5}px`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
