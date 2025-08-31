function MovingSportsList() {
  const sports = [
    'Futsal', 
    'Cricket', 
    'Volleyball', 
    'Beach Volleyball', 
    'Batminton', 
    'Table Tennis', 
    'Carrom'
  ];

  return (
    <div className="overflow-hidden py-4 relative">
      <style>{`
        /* Marquee scroll */
        .marquee {
          display: flex;
          width: max-content;
          animation: marquee 20s linear infinite;
        }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Animated gradient text */
        .animated-gradient {
          background: linear-gradient(0deg, #0097B2, #BFAE5F, #0097B2, #BFAE5F);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 5s linear infinite;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
      `}</style>

      <div className="flex marquee">
        {/* First copy */}
        {sports.map((sport, idx) => (
          <span
            key={`first-${idx}`}
            className="text-3xl md:text-5xl font-bold px-6 uppercase tracking-wide whitespace-nowrap animated-gradient"
          >
            {sport}
          </span>
        ))}

        {/* Second copy */}
        {sports.map((sport, idx) => (
          <span
            key={`second-${idx}`}
            className="text-3xl md:text-5xl font-bold px-6 uppercase tracking-wide whitespace-nowrap animated-gradient"
          >
            {sport}
          </span>
        ))}
      </div>
    </div>
  );
}



export default MovingSportsList;